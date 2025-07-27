"use client";
import React, { useState } from "react";
import { uploadAllProductsToFirebase, clearAllProductsFromFirebase } from "@/lib/utils/uploadProducts";

const AdminPanel = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleUploadProducts = async () => {
    setIsUploading(true);
    setMessage("Uploading products to Firebase...");
    
    try {
      const result = await uploadAllProductsToFirebase();
      
      if (result.success) {
        const addedCount = result.results.filter(r => r.action === "added").length;
        const updatedCount = result.results.filter(r => r.action === "updated").length;
        
        setMessage(
          `✅ Success! Added: ${addedCount} products, Updated: ${updatedCount} products. Total: ${result.results.length} products processed.`
        );
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearProducts = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL products from Firebase? This cannot be undone!")) {
      return;
    }

    setIsClearing(true);
    setMessage("Clearing all products from Firebase...");
    
    try {
      const result = await clearAllProductsFromFirebase();
      
      if (result.success) {
        setMessage(`🗑️ Successfully deleted all products from Firebase.`);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsClearing(false);
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
        >
          🔧 Admin
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🔧 Admin Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Product Management</h4>
          <div className="space-y-2">
            <button
              onClick={handleUploadProducts}
              disabled={isUploading || isClearing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isUploading ? "Uploading..." : "📦 Upload All Products"}
            </button>
            
            <button
              onClick={handleClearProducts}
              disabled={isUploading || isClearing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isClearing ? "Clearing..." : "🗑️ Clear All Products"}
            </button>
          </div>
        </div>
        
        {message && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>⚠️ Use these functions carefully!</p>
          <p>• Upload adds/updates all products from products.js</p>
          <p>• Clear removes ALL products from Firebase</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
