import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContactRound, Monitor, Presentation } from "lucide-react";
import { Suez_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const font = Suez_One({
  weight: "400",
  subsets: ["latin"],
});

const DashboardBar = () => {
  return (
    <div className="w-[250px] h-full px-5 pt-7 flex flex-col">
      <div className="flex flex-col gap-y-1">
        <Button
          variant={"ghost"}
          className="flex items-center justify-start w-full aspect-square py-6 group"
        >
          <Monitor className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground" />
          <span className="font-medium text-muted-foreground text-sm group-hover:text-foreground">
            Projects
          </span>
        </Button>

        <Button
          variant={"ghost"}
          className="flex items-center justify-start w-full aspect-square py-6 group"
        >
          <ContactRound className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-foreground" />
          <span className="font-medium text-muted-foreground text-sm group-hover:text-foreground">
            Collaborators
          </span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardBar;
