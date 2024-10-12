import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },

  client: {
    NEXT_PUBLIC_FIRESTORE_API_KEY: z.string(),
    NEXT_PUBLIC__FIRESTORE_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FIRESTORE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_FIRESTORE_APP_ID: z.string(),
    NEXT_PUBLIC_FIRESTORE_MEASUREMENT_ID: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_FIRESTORE_API_KEY: process.env.NEXT_PUBLIC_FIRESTORE_API_KEY,
    NEXT_PUBLIC__FIRESTORE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC__FIRESTORE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIRESTORE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIRESTORE_PROJECT_ID,
    NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIRESTORE_APP_ID: process.env.NEXT_PUBLIC_FIRESTORE_APP_ID,
    NEXT_PUBLIC_FIRESTORE_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_FIRESTORE_MEASUREMENT_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
