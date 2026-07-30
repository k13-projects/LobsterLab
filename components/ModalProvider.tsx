"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import Modal from "./Modal";
import OrderPanel from "./OrderPanel";
import CateringPanel from "./CateringPanel";

type Ctx = { openOrder: () => void; openCatering: () => void };

const ModalCtx = createContext<Ctx | null>(null);

export function useModals() {
  const ctx = useContext(ModalCtx);
  if (!ctx) throw new Error("useModals must be used inside <ModalProvider>");
  return ctx;
}

/**
 * Holds the two pop-ups the client spec calls for:
 *   ORDER ONLINE   -> Pickup (Toast) vs Delivery (DoorDash / Grubhub)
 *   ORDER CATERING -> ezCater plus an inquiry form
 */
export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState(false);
  const [catering, setCatering] = useState(false);

  const value = useMemo<Ctx>(
    () => ({
      openOrder: () => {
        track("order_modal_open");
        setOrder(true);
      },
      openCatering: () => {
        track("catering_modal_open");
        setCatering(true);
      },
    }),
    [],
  );

  return (
    <ModalCtx.Provider value={value}>
      {children}

      <Modal
        open={order}
        onClose={() => setOrder(false)}
        title="Order Online"
        subtitle="Pick up at the counter or have it delivered."
      >
        <OrderPanel />
      </Modal>

      <Modal
        open={catering}
        onClose={() => setCatering(false)}
        title="Order Catering"
        subtitle="Order straight through ezCater, or send us the details and we'll build it with you."
        size="lg"
      >
        <CateringPanel onDone={() => setCatering(false)} />
      </Modal>
    </ModalCtx.Provider>
  );
}
