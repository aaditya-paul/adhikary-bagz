"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { useNotification } from "@/hooks/useNotification";
import NotificationModal from "@/components/NotificationModal";
import Link from "next/link";
import Image from "next/image";
import { getUserOrders, getMultipleOrderDetails } from "@/lib/utils/findData";

const OrdersPage = () => {
  const router = useRouter();
  const { user, isLoggedin, isLoading } = useContext(UserContext);
  const {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !isLoggedin) {
      router.push("/signin");
    }
  }, [isLoggedin, isLoading, router]);

  // Load orders from Firestore
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (isLoggedin && user && user.uid) {
        try {
          setIsLoadingOrders(true);
          console.log("Fetching orders for user:", user.uid);

          // First, get the user's order IDs array
          const userOrdersResult = await getUserOrders(user.uid);

          if (!userOrdersResult.success) {
            showError(userOrdersResult.error || "Failed to fetch orders");
            setOrders([]);
            return;
          }

          console.log("User order IDs:", userOrdersResult.orders);

          // If user has no orders, set empty array
          if (
            !userOrdersResult.orders ||
            userOrdersResult.orders.length === 0
          ) {
            setOrders([]);
            return;
          }

          // Extract order IDs from the user's orders array
          const orderIds = userOrdersResult.orders.map((order) => order.id);
          console.log("Extracted order IDs:", orderIds);

          // Fetch detailed order information for each order ID
          const orderDetailsResult = await getMultipleOrderDetails(orderIds);

          if (!orderDetailsResult.success) {
            showError(
              orderDetailsResult.error || "Failed to fetch order details"
            );
            setOrders([]);
            return;
          }

          console.log("Fetched order details:", orderDetailsResult.orders);

          // Sort orders by creation date (newest first)
          const sortedOrders = orderDetailsResult.orders.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB - dateA;
          });

          setOrders(sortedOrders);

          if (
            orderDetailsResult.errors &&
            orderDetailsResult.errors.length > 0
          ) {
            showWarning(
              `Some orders could not be loaded: ${orderDetailsResult.errors.length} failed`
            );
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          showError("An error occurred while loading orders");
          setOrders([]);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    fetchUserOrders();
  }, [isLoggedin, user, showError, showWarning]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  if (isLoading || isLoadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-babas-neue">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedin || !user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 font-babas-neue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">
              Order History
            </h1>
            <Link
              href="/profile"
              className="self-start sm:self-auto inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Profile
            </Link>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            View and track all your orders
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders. Start shopping to see your order
              history here.
            </p>
            <Link
              href="/"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.orderNumber || order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(
                          order.createdAt || order.date || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status || "processing"
                        )}`}
                      >
                        {getStatusText(order.status || "processing")}
                      </span>
                      <span className="text-lg font-medium text-gray-900">
                        ${(order.totalPrice || order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {(order.cartItems || order.items || []).map(
                      (item, index) => (
                        <div
                          key={item.id || index}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={
                                  item.primaryImage ||
                                  item.image ||
                                  "/assests/bags/bag_black.png"
                                }
                                alt={item.name || "Product"}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.name || "Unknown Product"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Size: {item.selectedSize || "One Size"} • Qty:{" "}
                              {item.quantity || 1}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            $
                            {((item.price || 0) * (item.quantity || 1)).toFixed(
                              2
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      {(order.status === "delivered" ||
                        order.status === "completed") && (
                        <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Reorder
                        </button>
                      )}
                      {(order.status === "shipped" ||
                        order.status === "processing") && (
                        <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Track Order
                        </button>
                      )}
                      {order.status === "processing" && (
                        <button className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onClose={hideNotification}
      />
    </div>
  );
};

export default OrdersPage;
