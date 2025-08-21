import {
  collection,
  addDoc,
  setDoc,
  doc,
  writeBatch,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { products } from "../../data/products.js";

// Add a single product to Firebase
export const addProductToFirebase = async (product) => {
  try {
    // Check if product already exists
    const q = query(collection(db, "Products"), where("id", "==", product.id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log(`Product with id ${product.id} already exists. Updating...`);
      // Update existing product
      const docRef = querySnapshot.docs[0].ref;
      await setDoc(docRef, product, { merge: true });
      console.log(`Product ${product.name} updated successfully`);
      return { success: true, action: "updated", id: product.id };
    } else {
      // Add new product
      const docRef = await addDoc(collection(db, "Products"), product);
      console.log(
        `Product ${product.name} added successfully with ID: ${docRef.id}`
      );
      return { success: true, action: "added", id: docRef.id };
    }
  } catch (error) {
    console.error("Error adding product to Firebase:", error);
    return { success: false, error: error.message };
  }
};

// Add multiple products to Firebase using batch write
export const addMultipleProductsToFirebase = async (productsArray) => {
  const batch = writeBatch(db);
  const results = [];

  try {
    console.log(
      `Starting to add ${productsArray.length} products to Firebase...`
    );

    for (const product of productsArray) {
      // Check if product already exists
      const q = query(
        collection(db, "Products"),
        where("id", "==", product.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing product
        const docRef = querySnapshot.docs[0].ref;
        batch.set(docRef, product, { merge: true });
        results.push({ id: product.id, name: product.name, action: "updated" });
      } else {
        // Add new product
        const docRef = doc(collection(db, "Products"));
        batch.set(docRef, product);
        results.push({ id: product.id, name: product.name, action: "added" });
      }
    }

    // Commit the batch
    await batch.commit();
    console.log("Batch write completed successfully!");

    return {
      success: true,
      message: `Successfully processed ${productsArray.length} products`,
      results: results,
    };
  } catch (error) {
    console.error("Error in batch write:", error);
    return {
      success: false,
      error: error.message,
      results: results,
    };
  }
};

// Upload all products from the products.js file to Firebase
export const uploadAllProductsToFirebase = async () => {
  try {
    console.log("🚀 Starting to upload all products to Firebase...");
    console.log(`📦 Found ${products.length} products to upload`);

    const result = await addMultipleProductsToFirebase(products);

    if (result.success) {
      console.log("✅ All products uploaded successfully!");
      console.log("📊 Summary:");

      const addedCount = result.results.filter(
        (r) => r.action === "added"
      ).length;
      const updatedCount = result.results.filter(
        (r) => r.action === "updated"
      ).length;

      console.log(`   📝 Added: ${addedCount} products`);
      console.log(`   🔄 Updated: ${updatedCount} products`);
      console.log(`   📋 Total: ${result.results.length} products processed`);

      // Show details for each product
      result.results.forEach((product, index) => {
        console.log(
          `   ${index + 1}. ${product.name} (ID: ${product.id}) - ${
            product.action
          }`
        );
      });
    } else {
      console.error("❌ Failed to upload products:", result.error);
    }

    return result;
  } catch (error) {
    console.error("❌ Error uploading products:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Clear all products from Firebase (use with caution!)
export const clearAllProductsFromFirebase = async () => {
  try {
    console.log("⚠️  Warning: This will delete ALL products from Firebase!");

    const querySnapshot = await getDocs(collection(db, "Products"));
    const batch = writeBatch(db);

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`🗑️  Successfully deleted ${querySnapshot.size} products`);

    return {
      success: true,
      message: `Deleted ${querySnapshot.size} products`,
    };
  } catch (error) {
    console.error("❌ Error clearing products:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get product count from Firebase
export const getProductCountFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Products"));
    console.log(`📊 Firebase currently has ${querySnapshot.size} products`);
    return querySnapshot.size;
  } catch (error) {
    console.error("❌ Error getting product count:", error);
    return 0;
  }
};

// Verify uploaded products
export const verifyUploadedProducts = async () => {
  try {
    console.log("🔍 Verifying uploaded products...");

    const querySnapshot = await getDocs(collection(db, "Products"));
    const firebaseProducts = [];

    querySnapshot.forEach((doc) => {
      firebaseProducts.push({ id: doc.id, ...doc.data() });
    });

    console.log(`📊 Verification Results:`);
    console.log(`   Local products: ${products.length}`);
    console.log(`   Firebase products: ${firebaseProducts.length}`);

    // Check if all local products are in Firebase
    const missingProducts = products.filter(
      (localProduct) =>
        !firebaseProducts.some((fbProduct) => fbProduct.id === localProduct.id)
    );

    if (missingProducts.length > 0) {
      console.log(`❌ Missing products in Firebase: ${missingProducts.length}`);
      missingProducts.forEach((product) => {
        console.log(`   - ${product.name} (ID: ${product.id})`);
      });
    } else {
      console.log("✅ All local products found in Firebase!");
    }

    return {
      success: true,
      localCount: products.length,
      firebaseCount: firebaseProducts.length,
      missingProducts: missingProducts,
      firebaseProducts: firebaseProducts,
    };
  } catch (error) {
    console.error("❌ Error verifying products:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Node.js execution function
export const runUploadScript = async () => {
  console.log("🎯 Adhikary Bagz Product Upload Script");
  console.log("================================");

  try {
    // Step 1: Check current Firebase state
    await getProductCountFromFirebase();

    // Step 2: Upload all products
    const uploadResult = await uploadAllProductsToFirebase();

    if (uploadResult.success) {
      // Step 3: Verify the upload
      await verifyUploadedProducts();

      console.log("\n🎉 Upload script completed successfully!");
      console.log(
        "   Your Firebase 'Products' collection is now populated with luxury handbag data."
      );
      console.log(
        "   You can now use these products in your cart and product pages."
      );
    } else {
      console.error("\n❌ Upload script failed:", uploadResult.error);
    }
  } catch (error) {
    console.error("\n💥 Unexpected error:", error);
  }
};

// Export for Node.js execution
if (
  typeof process !== "undefined" &&
  process.argv &&
  process.argv.includes("--run-upload")
) {
  runUploadScript();
}
