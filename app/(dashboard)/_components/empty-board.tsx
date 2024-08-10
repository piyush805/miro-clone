"use client";

import Image from "next/image";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const EmptyBoard = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const onClick = () => {
    if (!organization) return;
    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created!");
        router.push(`/board/${id}`);
      })
      .catch((err) => toast.error("Failed to create board"));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image src="/note.png" alt="Empty " width={110} height={110} />
      <h2 className=" text-2xl font-semibold mt-6">Create your first board!</h2>
      <h2 className=" text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </h2>
      <div className="mt-6">
        <Button onClick={onClick} size={"lg"} disabled={pending}>
          Create board
        </Button>
      </div>
    </div>
  );
};
