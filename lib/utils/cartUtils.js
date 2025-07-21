import { findCartItems } from "@/lib/utils/findData";

/**
 * Processes cart items to get full product details
 * @param {Array} cartItems - Array of cart items with basic info
 * @returns {Promise<Array>} - Array of cart items with full product details
 */
export const processCartItems = async (cartItems = []) => {
  if (!cartItems || cartItems.length === 0) {
    return [];
  }

  const loadedProducts = [];

  try {
    for (const element of cartItems) {
      console.log("Processing cart item:", element);
      const product = await findCartItems(element.id);

      if (product) {
        loadedProducts.push({
          ...product,
          quantity: element.quantity,
          selectedSize: element.selectedSize,
          updatedAt: element.updatedAt,
          addedAt: element.addedAt,
        });
      } else {
        console.warn(`Product not found for ID: ${element.id}`);
        // Create placeholder for missing product
        loadedProducts.push({
          id: element.id,
          name: "Unknown Product",
          quantity: element.quantity || 1,
          selectedSize: element.selectedSize || "One Size",
          price: 0,
          images: ["/placeholder-image.png"], // You can add a placeholder image
          description: "Product information unavailable",
        });
      }
    }

    console.log("Processed cart products:", loadedProducts);
    return loadedProducts;
  } catch (error) {
    console.error("Error processing cart items:", error);
    return loadedProducts; // Return what we have so far
  }
};

/**
 * Calculates cart totals
 * @param {Array} cartItems - Array of cart items with prices
 * @returns {Object} - Object containing subtotal, item count, etc.
 */
export const calculateCartTotals = (cartItems = []) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  
  const itemCount = cartItems.length;
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return {
    subtotal,
    itemCount,
    totalQuantity,
  };
};
