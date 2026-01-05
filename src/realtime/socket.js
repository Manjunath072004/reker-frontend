let socket = null;

export const connectSocket = ({ onPayment, onNotification }) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    const socket = new WebSocket(
        `ws://127.0.0.1:8000/ws/realtime/?token=${localStorage.getItem("access")}`
    );

    socket.onopen = () => {
        console.log(" Realtime socket connected");
    };

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(" REALTIME:", data);

        if (data.type === "PAYMENT_UPDATE" && onPayment) {
            onPayment(data);
        }

        if (data.type === "NEW_NOTIFICATION" && onNotification) {
            onNotification(data);
        }
    };

    socket.onclose = () => {
        console.log(" Realtime socket disconnected");
    };

    socket.onerror = (err) => {
        console.error("Socket error", err);
    };
};

export const disconnectSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};
