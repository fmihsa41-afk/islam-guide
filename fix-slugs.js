const Database = require('better-sqlite3');
const db = new Database('./db/sqlite.db');

console.log('🔧 Fixing course slugs...\n');

const courses = db.prepare('SELECT id, title, slug FROM courses').all();

console.log(`Found ${courses.length} courses\n`);

for (const course of courses) {
    if (!course.slug || course.slug === '') {
        const slug = course.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        db.prepare('UPDATE courses SET slug = ? WHERE id = ?').run(slug, course.id);
        console.log(`✅ "${course.title}" -> slug: "${slug}"`);
    } else {
        console.log(`⏭️  "${course.title}" already has slug: "${course.slug}"`);
    }
}

console.log('\n✨ Done! Restart your server now.');
db.close();
