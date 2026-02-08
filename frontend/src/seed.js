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

addIsAvailableToItems();