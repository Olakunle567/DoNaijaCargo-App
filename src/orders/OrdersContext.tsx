import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ShopOrder = {
  id: string;
  date: string;
  items: { name: string; emoji: string; qty: number; price: number }[];
  total: number;
};

type OrdersContextValue = {
  orders: ShopOrder[];
  addOrder: (items: ShopOrder["items"], total: number) => void;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<ShopOrder[]>([]);

  const addOrder = useCallback((items: ShopOrder["items"], total: number) => {
    setOrders((prev) => [
      {
        id: `SHP-${Math.floor(10000 + Math.random() * 89999)}`,
        date: new Date().toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" }),
        items,
        total,
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo(() => ({ orders, addOrder }), [orders, addOrder]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
