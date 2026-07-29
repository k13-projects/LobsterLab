"use client";

import { useModals } from "./ModalProvider";

const pill =
  "inline-flex items-center justify-center rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-[0.12em] transition hover:-translate-y-0.5";

export function OrderOnlineButton({ className = "" }: { className?: string }) {
  const { openOrder } = useModals();
  return (
    <button
      type="button"
      onClick={openOrder}
      className={`${pill} bg-navy text-white hover:bg-navy-deep ${className}`}
    >
      Order Online
    </button>
  );
}

export function OrderCateringButton({ className = "" }: { className?: string }) {
  const { openCatering } = useModals();
  return (
    <button
      type="button"
      onClick={openCatering}
      className={`${pill} bg-orange text-white hover:bg-orange-dark ${className}`}
    >
      Order Catering
    </button>
  );
}
