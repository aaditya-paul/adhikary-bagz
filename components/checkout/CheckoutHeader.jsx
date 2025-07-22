"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/Modal";
import { useConfirmationModal } from "@/hooks/useModal";

const CheckoutHeader = () => {
  const router = useRouter();
  const confirmModal = useConfirmationModal();

  const handleReturnToCart = async (e) => {
    e.preventDefault();

    const confirmed = await confirmModal.openConfirmation({
      title: "Return to Cart",
      message:
        "Are you sure you want to return to cart? You will lose all progress in the checkout process and will need to re-enter your information.",
      confirmText: "Yes, Return to Cart",
      cancelText: "Stay on Checkout",
      type: "warning",
    });

    if (confirmed) {
      router.push("/cart");
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">
          Secure Checkout
        </h1>
        <button
          onClick={handleReturnToCart}
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
          Return to Cart
        </button>
      </div>
      <p className="text-gray-600 text-sm sm:text-base">
        Complete your order securely
      </p>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.handleCancel}
        onConfirm={confirmModal.handleConfirm}
        title={confirmModal.config.title}
        message={confirmModal.config.message}
        confirmText={confirmModal.config.confirmText}
        cancelText={confirmModal.config.cancelText}
        type={confirmModal.config.type}
      />
    </div>
  );
};

export default CheckoutHeader;
