import React, { createContext, useContext, useMemo, useState } from "react";

interface NotificationsOverlayContextValue {
  isNotificationsOpen: boolean;
  toggleNotifications: () => void;
  closeNotifications: () => void;
}

const NotificationsOverlayContext = createContext<NotificationsOverlayContextValue | null>(null);

export function NotificationsOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isNotificationsOpen,
      toggleNotifications: () => setIsNotificationsOpen((open) => !open),
      closeNotifications: () => setIsNotificationsOpen(false),
    }),
    [isNotificationsOpen],
  );

  return (
    <NotificationsOverlayContext.Provider value={value}>
      {children}
    </NotificationsOverlayContext.Provider>
  );
}

export function useNotificationsOverlay() {
  const context = useContext(NotificationsOverlayContext);
  if (!context) {
    throw new Error("useNotificationsOverlay must be used within NotificationsOverlayProvider");
  }
  return context;
}
