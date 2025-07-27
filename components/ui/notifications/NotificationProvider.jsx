"use client";
import React from "react";
import NotificationModal from "./NotificationModal";
import { useNotification } from "@/hooks/useNotification";

const NotificationProvider = ({ children }) => {
  const { notification, hideNotification } = useNotification();

  return (
    <>
      {children}
      <NotificationModal
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onClose={hideNotification}
      />
    </>
  );
};

export default NotificationProvider;
