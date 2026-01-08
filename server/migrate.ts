import { db } from './db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
    console.log('🔄 Running database migrations...');

    const migrationsDir = path.join(process.cwd(), 'migrations');

    if (fs.existsSync(migrationsDir)) {
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        for (const file of files) {
            console.log(`  → ${file}`);
            const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
            const statements = sqlContent.split(';').filter(s => s.trim());

            for (const statement of statements) {
                if (statement.trim()) {
                    await db.run(sql.raw(statement));
                }
            }
        }

        console.log('✅ Migrations complete!');
    }
}

runMigrations().catch(console.error);
