import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// for migrations
const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient);

async function main() {
    console.log("Running migrations");
    await migrate(db, { migrationsFolder: "./drizzle" });
    await migrationClient.end();
    console.log("Migrations complete");
}

try {
    await main();
} catch (e) {
    console.error(e);
}
