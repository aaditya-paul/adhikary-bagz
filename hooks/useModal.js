import { useState, useCallback } from "react";

/**
 * Custom hook for managing modal state and actions
 * @returns {Object} Modal state and control functions
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};

/**
 * Custom hook for managing confirmation modal with promise support
 * @returns {Object} Confirmation modal state and control functions
 */
export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "Confirm Action",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "default",
  });
  const [resolvePromise, setResolvePromise] = useState(null);

  const openConfirmation = useCallback((modalConfig = {}) => {
    return new Promise((resolve) => {
      setConfig((prev) => ({ ...prev, ...modalConfig }));
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  return {
    isOpen,
    config,
    openConfirmation,
    handleConfirm,
    handleCancel,
  };
};

/**
 * Custom hook for managing alert modal
 * @returns {Object} Alert modal state and control functions
 */
export const useAlertModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "Alert",
    message: "",
    buttonText: "OK",
    type: "info",
  });

  const showAlert = useCallback((alertConfig = {}) => {
    setConfig((prev) => ({ ...prev, ...alertConfig }));
    setIsOpen(true);
  }, []);

  const closeAlert = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Convenience methods for different alert types
  const showSuccess = useCallback(
    (message, title = "Success") => {
      showAlert({ message, title, type: "success" });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message, title = "Error") => {
      showAlert({ message, title, type: "error" });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message, title = "Warning") => {
      showAlert({ message, title, type: "warning" });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message, title = "Information") => {
      showAlert({ message, title, type: "info" });
    },
    [showAlert]
  );

  return {
    isOpen,
    config,
    showAlert,
    closeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
