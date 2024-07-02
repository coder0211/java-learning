import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { Bell, Folder, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RoomsSection from "./room-section";

const Aside = () => {
  return (
    <aside className="w-14 h-full overflow-hidden flex flex-col border-r fixed py-5 px-1.5 bg-white z-[49]">
      <Link
        className="flex w-full aspect-square items-center justify-center relative"
        href={"/"}
      >
        <Image
          src={"/logo.svg"}
          alt="logo"
          className="top-0 left-0 p-1"
          width={40}
          height={40}
        />
      </Link>

      <div className="mt-12 flex flex-col items-center py-2 gap-y-3 justify-center border rounded-md">
        <UserButton />

        <Separator />

        <div className="flex flex-col gap-y-2">
          <button className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded-md transition">
            <Bell className="w-4 h-4" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center hover:bg-slate-100 rounded-md transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Separator className="my-4 h-[2px]" />

      <RoomsSection />
    </aside>
  );
};

export default Aside;
