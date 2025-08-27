// seedCategories.js
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js";  
import { slug } from "../lib/utils.js";   

async function seedCategories() {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));

    const updates = querySnapshot.docs.map(async (document) => {
      const data = document.data();

      // Only add slug if missing
      if (!data.slug && data.name) {
        const slugified = slug(data.name);
        await updateDoc(doc(db, "categories", document.id), {
          slug: slugified,
        });
        console.log(`Updated: ${data.name} -> ${slugified}`);
      }
    });

    await Promise.all(updates);
    console.log("✅ Seeding completed!");
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
  }
}

seedCategories();
