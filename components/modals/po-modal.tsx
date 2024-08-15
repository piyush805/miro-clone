// Zustand controlled modal
"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";
import { useAction } from "convex/react";
import { useOrganization } from "@clerk/nextjs";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProModal } from "@/store/use-pro-modal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();
  const pay = useAction(api.stripe.pay);
  const [pending, setPending] = useState(false);
  const { organization } = useOrganization();
  const onClick = async () => {
    if (!organization?.id) return;
    setPending(true);
    console.log("redirectUrl1");
    try {
      const redirectUrl = await pay({
        orgId: organization.id,
      });
      console.log("redirectUrl", redirectUrl);
      window.location.href = redirectUrl!;
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/pro.svg" alt="Pro" className="object-fit" fill />
        </div>
        <div
          className={cn(
            "text-neutral-700 mx-auto space-y-6 p-6",
            font.className
          )}
        >
          <h2 className="font-md text-lg">🚀Upgrade to Pro</h2>
          <div className="pl-3">
            <ul className="text-[11px] space-y-1 list-desc">
              <li>Unlimited boards</li>
              <li>Unlimited tools</li>
              <li>Unlimited organizations</li>
              <li>Unlimited members</li>
            </ul>
          </div>
          <Button size="sm" className="w-full" onClick={onClick}>
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
