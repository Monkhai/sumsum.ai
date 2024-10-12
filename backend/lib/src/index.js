"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFirestoreDocFromFile = exports.createSummary = exports.onUserCreate = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const openai_1 = require("openai");
const storage_1 = require("firebase-functions/v2/storage");
admin.initializeApp();
var OpenAIModules;
(function (OpenAIModules) {
    OpenAIModules["GPT_3_5_TURBO"] = "gpt-3.5-turbo";
    OpenAIModules["GPT_4"] = "gpt-4";
    OpenAIModules["GPT_4_O_MINI"] = "gpt-4o-mini";
})(OpenAIModules || (OpenAIModules = {}));
var OpenAIMessageRoles;
(function (OpenAIMessageRoles) {
    OpenAIMessageRoles["USER"] = "user";
    OpenAIMessageRoles["SYSTEM"] = "system";
})(OpenAIMessageRoles || (OpenAIMessageRoles = {}));
const firestore = admin.firestore();
const summarizePrefixMessage = {
    role: OpenAIMessageRoles.USER,
    content: "Make a concicse summary out of the following provided notes. You may add a little infromation that does not exist in the notes if it helps you further clarify the needed concepts",
};
const summarizeSuffixMessage = {
    role: OpenAIMessageRoles.USER,
    content: "These are all the notes, please continue with your summary, please provide the returned string in the markdown file format",
};
const userFields = ["displayName", "email", "photoURL"];
const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
async function provideNotes(userId, documentIds) {
    console.log("provide notes");
    const messages = [summarizePrefixMessage];
    const collectionRef = firestore.collection("notes");
    const query = await collectionRef.where("__name__", "in", documentIds).get();
    console.log("docs");
    console.log(query.docs);
    for (const document of query.docs) {
        const note = document.data();
        if (note.userId != userId) {
            throw new functions.https.HttpsError("permission-denied", "User attempted to access a document of another user!");
        }
        const content = await admin.storage().bucket().file(note.assetPath).download();
        console.log(content.toString().slice(0, 20), content.toString().length);
        messages.push({
            role: "user",
            content: content.toString(),
        });
    }
    messages.push(summarizeSuffixMessage);
    return messages;
}
async function createSummaryFile(filePath, summary, userId, data) {
    const buffer = Buffer.from(summary, "utf-8");
    const file = admin.storage().bucket().file(filePath);
    await file.save(buffer, {
        metadata: {
            contentType: "text/markdown",
        },
    });
    await firestore.collection("summaries").add({
        title: data.title,
        userId: userId,
        assetPath: filePath,
        baseNoteIds: data.documentIds,
    });
    return filePath;
}
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const userRecord = {};
    userFields.forEach((field) => {
        if (user[field] && field in userFields) {
            userRecord[field] = user[field];
        }
    });
    try {
        await firestore
            .collection("users")
            .doc(user.uid)
            .set(Object.assign(Object.assign({}, userRecord), { createdAt: admin.firestore.FieldValue.serverTimestamp() }));
        console.log(`User document created for ${user.uid}`);
    }
    catch (error) {
        console.error(`Error creating user document for ${user.uid}:`, error);
    }
});
exports.createSummary = functions.https.onCall(async (data, context) => {
    if (!context.auth && !isEmulator) {
        throw new functions.https.HttpsError("unauthenticated", "User must provide auth information!");
    }
    const userId = isEmulator ? data.userId : context.auth.uid;
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
        model: OpenAIModules.GPT_3_5_TURBO,
        messages: await provideNotes(userId, data.documentIds),
    });
    const summary = completion.choices[0].message.content || "";
    const filePath = `${userId}/summaries/${data.title.replace(" ", "_")}.md`;
    await createSummaryFile(filePath, summary, userId, data);
    return {
        filePath: filePath,
    };
});
exports.createFirestoreDocFromFile = (0, storage_1.onObjectFinalized)(async (event) => {
    const [userId, collectionType, title] = event.data.name.split("/");
    if (collectionType != "notes") {
        return;
    }
    await firestore.collection(collectionType).add({
        title: title,
        tags: [],
        userId: userId,
        assetPath: event.data.name,
    });
});
//# sourceMappingURL=index.js.map