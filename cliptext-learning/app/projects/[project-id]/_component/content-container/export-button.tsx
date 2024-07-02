import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportEditToDocx,
  exportEditToMP3,
  exportEditToMP4,
} from "@/exports/exporter";
import { useProjects } from "@/stores/projects-store";
import { useTranscript } from "@/stores/transcript-store";
import { Kind } from "@/types/project-types";
import {
  ArrowDownToLine,
  FileType,
  Film,
  Headphones,
  LoaderCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ExportButton = () => {
  const { edits } = useTranscript();
  const { currentProject } = useProjects();
  const [onExportMP4, setOnExportMP4] = useState(false);
  const [onExportMP3, setOnExportMP3] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"}>
          <ArrowDownToLine className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-[150px]">
        <DropdownMenuLabel>Export your Edits</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            exportEditToDocx(edits ?? []);
          }}
        >
          <FileType className="w-4 h-4 text-muted-foreground mr-2" />
          Word
          <DropdownMenuShortcut>.docx</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={onExportMP3}
          onClick={async () => {
            setOnExportMP3(true);
            toast.info("Exporting your audio edits...");
            try {
              await exportEditToMP3(
                currentProject?.id!,
                currentProject?.url!,
                currentProject?.name!
              );
              toast.success("Exported your audio edits successfully!");
            } catch (e) {
              toast.error(
                "Couldn't export your audio edits! Please try again or contact support."
              );
            } finally {
              setOnExportMP3(false);
            }
          }}
        >
          {!onExportMP3 && (
            <Headphones className="w-4 h-4 text-muted-foreground mr-2" />
          )}
          {onExportMP3 && (
            <LoaderCircle className="w-4 h-4 text-muted-foreground mr-2 animate-spin" />
          )}
          Audio
          <DropdownMenuShortcut>.mp3</DropdownMenuShortcut>
        </DropdownMenuItem>
        {currentProject?.kind === Kind.Video && (
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={onExportMP4}
            onClick={async () => {
              setOnExportMP4(true);
              toast.info("Exporting your edits...");
              try {
                await exportEditToMP4(
                  currentProject?.id!,
                  currentProject?.url!,
                  currentProject?.name!
                );
                toast.success("Exported your video edits successfully!");
              } catch (e) {
                toast.error(
                  "Couldn't export your video edits! Please try again or contact support."
                );
              } finally {
                setOnExportMP4(false);
              }
            }}
          >
            {!onExportMP4 && (
              <Film className="w-4 h-4 text-muted-foreground mr-2" />
            )}
            {onExportMP4 && (
              <LoaderCircle className="w-4 h-4 text-muted-foreground mr-2 animate-spin" />
            )}
            Video
            <DropdownMenuShortcut>.mp4</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
