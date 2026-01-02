import { createContext, useState } from "react";

export const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orderAmount, setOrderAmount] = useState("");

  return (
    <OrderContext.Provider value={{ orderAmount, setOrderAmount }}>
      {children}
    </OrderContext.Provider>
  );
}
