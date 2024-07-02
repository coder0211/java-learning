import { cn } from "@/lib/utils";
import { Suez_One } from "next/font/google";
import Image from "next/image";
import React from "react";

const font = Suez_One({
  weight: "400",
  subsets: ["latin"],
});

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white">
      <Image
        src={"/logo.svg"}
        alt="logo"
        width={60}
        height={60}
        className="animate-bounce"
      />

      <h2
        className={cn(
          "mt-6 font-medium text-2xl text-muted-foreground tracking-wider",
          font.className
        )}
      >
        Cliptext
      </h2>
    </div>
  );
};

export default Loading;
