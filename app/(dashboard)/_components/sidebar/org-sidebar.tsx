"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { Poppins } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Banknote, LayoutDashboard, Star } from "lucide-react";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  const { organization } = useOrganization();
  const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
    orgId: organization?.id,
  });

  const [pending, setPending] = useState(false);
  const portal = useAction(api.stripe.portal);
  const pay = useAction(api.stripe.pay);
  const onClick = async () => {
    if (!organization?.id) return;
    setPending(true);
    try {
      const action = isSubscribed ? portal : pay;

      const redirectUrl = (await action({ orgId: organization.id })) as string;

      window.location.href = redirectUrl;
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" width={60} height={60} alt="Logo" />
          <span className={cn("font-semibold text-2xl", font.className)}>
            Board
          </span>
          {isSubscribed && <Badge variant="secondary">Pro</Badge>}
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
          variant={favorites ? "ghost" : "secondary"}
        >
          <Link href="/">
            <LayoutDashboard className="h-4 w-4 mr-2" /> Team boards
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
          variant={favorites ? "secondary" : "ghost"}
        >
          <Link href={{ pathname: "/", query: { favorites: true } }}>
            <Star className="h-4 w-4 mr-2" /> Favorite boards
          </Link>
        </Button>
        <Button
          onClick={onClick}
          disabled={pending}
          variant="ghost"
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Banknote className="h-4 w-4 mr-2" />
          {isSubscribed ? "Payment Settings" : "Upgrade"}
        </Button>
      </div>
    </div>
  );
};

export default OrgSidebar;
