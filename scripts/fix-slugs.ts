// scripts/fix-slugs.ts
import { db } from "../server/db";
import { courses } from "../shared/schema";
import { eq } from "drizzle-orm";

async function fixSlugs() {
    console.log("🔧 Fixing course slugs...");

    // Get all courses
    const allCourses = await db.select().from(courses);

    console.log(`Found ${allCourses.length} courses`);

    for (const course of allCourses) {
        // Generate slug from title if missing or empty
        if (!course.slug || course.slug === '') {
            const slug = course.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            await db.update(courses)
                .set({ slug })
                .where(eq(courses.id, course.id));

            console.log(`✅ Updated "${course.title}" -> slug: "${slug}"`);
        } else {
            console.log(`⏭️  Skipped "${course.title}" (already has slug: "${course.slug}")`);
        }
    }

    console.log("\n✨ Done! All courses now have slugs.");
    process.exit(0);
}

fixSlugs().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
