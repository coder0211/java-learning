import React from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface HintProps {
  children: React.ReactNode;
  label: string;
  side?: "left" | "top" | "right" | "bottom";
  sideOffset?: number;
  align?: "center" | "end" | "start";
  alignOffset?: number;
}

const Hint = ({
  children,
  label,
  side,
  sideOffset,
  align,
  alignOffset,
}: HintProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          className="bg-slate-700 border-slate-700"
        >
          <p className="font-normal text-sm text-white">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
