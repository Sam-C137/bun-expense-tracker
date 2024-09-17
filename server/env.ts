import { z } from "zod";

const envSchema = z.object({
    KINDE_DOMAIN: z.string(),
    KINDE_CLIENT_ID: z.string(),
    KINDE_CLIENT_SECRET: z.string(),
    KINDE_REDIRECT_URI: z.string(),
    KINDE_LOGOUT_REDIRECT_URI: z.string(),
    DATABASE_URL: z.string(),
    PGHOST: z.string(),
    PGDATABASE: z.string(),
    PGUSER: z.string(),
    PGPASSWORD: z.string(),
});

envSchema.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> {}
    }
}
