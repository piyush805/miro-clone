"use client";

import { useEffect, useState } from "react";
import { RenameModal } from "@/components/modals/rename-modal";
import { ProModal } from "@/components/modals/po-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    // make it visible only when client side rendering
    // else NextJS hydration errors
    return null;
  }
  return (
    <>
      {/* Can have multiple modals here - which go into root level of app */}
      <RenameModal />
      <ProModal />
    </>
  );
};
