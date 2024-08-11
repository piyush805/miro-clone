"use client";

import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Hint } from "@/app/(dashboard)/_components/hint";

interface ToolButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
}

export const ToolButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
  isDisabled,
}: ToolButtonProps) => {
  return (
    <Hint label={label} side="right" sideOffset={10}>
      <Button
        variant={isActive ? "boardActive" : "board"}
        size="icon"
        className="text-base font-normal px-2"
        onClick={onClick}
        disabled={isDisabled}
      >
        <div className="flex items-center gap-x-1">
          <Icon />
          {isActive && <span className="text-neutral-300">•</span>}
        </div>
      </Button>
    </Hint>
  );
};
