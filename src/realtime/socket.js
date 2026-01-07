let socket = null;

export const connectSocket = ({
  userId,
  merchantId,
  onPayment,
  onNotification,
}) => {
  // prevent duplicate connections
  if (socket) {
    socket.close();
    socket = null;
  }

  if (!userId && !merchantId) {
    console.warn("Realtime socket not started: missing IDs");
    return;
  }

  const url = `ws://127.0.0.1:8000/ws/realtime/?user=${userId}&merchant=${merchantId}`;

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("✅ Realtime socket connected");
  };

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log("⚡ REALTIME EVENT:", data);

    if (data.type === "PAYMENT_UPDATE") {
      onPayment?.(data);
    }

    if (data.type === "NEW_NOTIFICATION") {
      onNotification?.(data);
    }
  };

  socket.onclose = () => {
    console.log("❌ Realtime socket disconnected");
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("🔥 Realtime socket error", err);
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
