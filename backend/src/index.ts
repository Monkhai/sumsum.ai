import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';
import OpenAI from 'openai';
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { NoteType, SummaryType } from '../types';

admin.initializeApp();

enum OpenAIModules {
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_O_MINI = 'gpt-4o-mini',
}

enum OpenAIMessageRoles {
  USER = 'user',
  SYSTEM = 'system',
}

type OpenAIMessage = {
  role: OpenAIMessageRoles;
  content: string;
};

type SummaryData = {
  title: string;
  documentIds: string[];
  userId?: string; // Used for testing on the emulator only
};

const firestore = admin.firestore();

const summarizePrefixMessage: OpenAIMessage = {
  role: OpenAIMessageRoles.USER,
  content:
    'Make a concicse summary out of the following provided notes. You may add a little infromation that does not exist in the notes if it helps you further clarify the needed concepts',
};

const summarizeSuffixMessage: OpenAIMessage = {
  role: OpenAIMessageRoles.USER,
  content: 'These are all the notes, please continue with your summary, please provide the returned string in the markdown file format',
};

const userFields = ['displayName', 'email', 'photoURL'];

const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

async function provideNotes(userId: string, documentIds: string[]): Promise<OpenAIMessage[]> {
  console.log('provide notes');

  const messages: OpenAIMessage[] = [summarizePrefixMessage];

  const collectionRef = firestore.collection('notes');
  const query = await collectionRef.where('__name__', 'in', documentIds).get();
  console.log('docs');
  console.log(query.docs);

  for (const document of query.docs) {
    const note = document.data() as NoteType;

    if (note.userId != userId) {
      throw new functions.https.HttpsError('permission-denied', 'User attempted to access a document of another user!');
    }

    const content = await admin.storage().bucket().file(note.assetPath).download();
    console.log(content.toString().slice(0, 20), content.toString().length);

    messages.push({
      role: 'user',
      content: content.toString(),
    } as OpenAIMessage);
  }

  messages.push(summarizeSuffixMessage);
  return messages;
}

async function createSummaryFile(filePath: string, summary: string, userId: string, data: SummaryData): Promise<string> {
  const buffer = Buffer.from(summary, 'utf-8');
  const file = admin.storage().bucket().file(filePath);

  await file.save(buffer, {
    metadata: {
      contentType: 'text/markdown',
    },
  });

  await firestore.collection('summaries').add({
    title: data.title,
    userId: userId,
    assetPath: filePath,
    baseNoteIds: data.documentIds,
  } as SummaryType);

  return filePath;
}

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const userRecord: Record<string, string> = {};
  userFields.forEach((field) => {
    if (user[field as keyof UserRecord] && field in userFields) {
      userRecord[field] = user[field as keyof UserRecord] as string;
    }
  });

  try {
    await firestore
      .collection('users')
      .doc(user.uid)
      .set({
        ...userRecord,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    console.log(`User document created for ${user.uid}`);
  } catch (error) {
    console.error(`Error creating user document for ${user.uid}:`, error);
  }
});

export const createSummary = functions.https.onCall(async (data: SummaryData, context) => {
  if (!context.auth && !isEmulator) {
    throw new functions.https.HttpsError('unauthenticated', 'User must provide auth information!');
  }

  const userId = isEmulator ? data.userId! : context.auth!.uid;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: OpenAIModules.GPT_3_5_TURBO,
    messages: await provideNotes(userId, data.documentIds),
  });

  const summary = completion.choices[0].message.content || '';
  const filePath = `${userId}/summaries/${data.title.replace(' ', '_')}.md`;

  await createSummaryFile(filePath, summary, userId, data);

  return {
    filePath: filePath,
  };
});

export const createFirestoreDocFromFile = onObjectFinalized(async (event) => {
  const [userId, collectionType, title] = event.data.name.split('/') as [string, string, string];

  if (collectionType != 'notes') {
    return;
  }

  await firestore.collection(collectionType).add({
    title: title,
    tags: [] as string[],
    userId: userId,
    assetPath: event.data.name,
  } as NoteType);
});
