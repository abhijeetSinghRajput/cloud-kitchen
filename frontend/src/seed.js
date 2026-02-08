import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Add isAvailable field to all items (simple version for small collections)
 */
export const addIsAvailableToItems = async () => {
  try {
    console.log('Starting migration...');
    
    // Fetch all items
    const itemsSnap = await getDocs(collection(db, "items"));
    console.log(`Found ${itemsSnap.size} items`);

    let updated = 0;
    let skipped = 0;

    // Update each item
    for (const doc of itemsSnap.docs) {
      const data = doc.data();
      
      // Skip if already has isAvailable
      if (data.hasOwnProperty('isAvailable')) {
        console.log(`✓ Item "${data.name || doc.id}" already has isAvailable`);
        skipped++;
        continue;
      }

      // Add isAvailable field
      await updateDoc(doc.ref, { isAvailable: true });
      console.log(`✓ Updated item "${data.name || doc.id}"`);
      updated++;
    }

    console.log('✅ Migration completed!');
    console.log(`   Updated: ${updated} items`);
    console.log(`   Skipped: ${skipped} items`);
    
    return { success: true, updated, skipped };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

/**
 * Update all category.image URLs to WebP format
 */
export const migrateImagesToWebP = async () => {
  try {
    let updated = 0;
    let skipped = 0;

    // --- Categories ---
    const categoriesSnap = await getDocs(collection(db, "categories"));
    console.log(`Found ${categoriesSnap.size} categories`);

    for (const doc of categoriesSnap.docs) {
      const data = doc.data();
      const originalUrl = data.image;

      if (!originalUrl || typeof originalUrl !== "string") {
        console.log(`⚠️ Category "${data.name || doc.id}" has no image, skipping`);
        skipped++;
        continue;
      }

      if (originalUrl.includes("/f_webp/")) {
        console.log(`✓ Category "${data.name || doc.id}" already WebP`);
        skipped++;
        continue;
      }

      const webpUrl = originalUrl.replace("/upload/", "/upload/f_webp/");
      await updateDoc(doc.ref, { image: webpUrl });
      console.log(`✓ Updated category "${data.name || doc.id}" image to WebP`);
      updated++;
    }

    // --- Items ---
    const itemsSnap = await getDocs(collection(db, "items"));
    console.log(`Found ${itemsSnap.size} items`);

    for (const doc of itemsSnap.docs) {
      const data = doc.data();
      const originalUrl = data.image;

      if (!originalUrl || typeof originalUrl !== "string") {
        console.log(`⚠️ Item "${data.name || doc.id}" has no image, skipping`);
        skipped++;
        continue;
      }

      if (originalUrl.includes("/f_webp/")) {
        console.log(`✓ Item "${data.name || doc.id}" already WebP`);
        skipped++;
        continue;
      }

      const webpUrl = originalUrl.replace("/upload/", "/upload/f_webp/");
      await updateDoc(doc.ref, { image: webpUrl });
      console.log(`✓ Updated item "${data.name || doc.id}" image to WebP`);
      updated++;
    }

    console.log("✅ Image migration completed!");
    console.log(`   Updated: ${updated} images`);
    console.log(`   Skipped: ${skipped} images`);

    return { success: true, updated, skipped };
  } catch (error) {
    console.error("❌ Image migration failed:", error);
    throw error;
  }
};

// Run the migration
// migrateImagesToWebP();

// addIsAvailableToItems();