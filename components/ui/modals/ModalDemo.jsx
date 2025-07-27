"use client";
import React from "react";
import Modal, { ConfirmationModal, AlertModal } from "./Modal";
import {
  useModal,
  useConfirmationModal,
  useAlertModal,
} from "@/hooks/useModal";

const ModalDemo = () => {
  // Basic modal
  const basicModal = useModal();

  // Confirmation modal
  const confirmModal = useConfirmationModal();

  // Alert modal
  const alertModal = useAlertModal();

  // Handle confirmation modal with promise
  const handleDeleteAction = async () => {
    const confirmed = await confirmModal.openConfirmation({
      title: "Delete Item",
      message:
        "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
    });

    if (confirmed) {
      alertModal.showSuccess("Item deleted successfully!");
    }
  };

  const handleLogoutAction = async () => {
    const confirmed = await confirmModal.openConfirmation({
      title: "Sign Out",
      message: "Are you sure you want to sign out of your account?",
      confirmText: "Sign Out",
      cancelText: "Stay Signed In",
      type: "warning",
    });

    if (confirmed) {
      alertModal.showInfo("You have been signed out successfully.");
    }
  };

  return (
    <div className="p-8 space-y-6 font-babas-neue">
      <h1 className="text-3xl font-light text-gray-900 mb-8">Modal Demo</h1>

      {/* Basic Modal Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-gray-800">Basic Modals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={basicModal.openModal}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Basic Modal
          </button>

          <button
            onClick={() => alertModal.showSuccess("Order placed successfully!")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Success Alert
          </button>

          <button
            onClick={() =>
              alertModal.showError("Payment failed. Please try again.")
            }
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Error Alert
          </button>

          <button
            onClick={() =>
              alertModal.showWarning("Your session will expire in 5 minutes.")
            }
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Warning Alert
          </button>
        </div>
      </div>

      {/* Confirmation Modal Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-gray-800">
          Confirmation Modals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleDeleteAction}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Item (Danger)
          </button>

          <button
            onClick={handleLogoutAction}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Sign Out (Warning)
          </button>
        </div>
      </div>

      {/* Basic Modal */}
      <Modal
        isOpen={basicModal.isOpen}
        onClose={basicModal.closeModal}
        title="Custom Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a custom modal with premium styling that matches your NÓMADA
            brand theme. It features:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              Smooth animations with scale and fade effects
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              Blurred backdrop with subtle transparency
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              Clean, minimal design with rounded corners
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              Responsive sizing and keyboard navigation
            </li>
          </ul>
          <div className="flex gap-3 pt-4">
            <button
              onClick={basicModal.closeModal}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                basicModal.closeModal();
                alertModal.showSuccess("Action completed successfully!");
              }}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

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

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={alertModal.closeAlert}
        title={alertModal.config.title}
        message={alertModal.config.message}
        buttonText={alertModal.config.buttonText}
        type={alertModal.config.type}
      />
    </div>
  );
};

export default ModalDemo;
