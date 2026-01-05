import { createContext, useEffect } from "react";
import { connectSocket, disconnectSocket } from "../realtime/socket";
import { fetchUnreadCount } from "../api/notifications";

export const RealtimeContext = createContext();

export const RealtimeProvider = ({ children, refreshTransactions }) => {

  useEffect(() => {
    connectSocket({
      onPayment: () => {
        refreshTransactions?.();
      },
      onNotification: () => {
        fetchUnreadCount();
      },
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{}}>
      {children}
    </RealtimeContext.Provider>
  );
};
