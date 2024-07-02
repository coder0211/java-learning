import { Edit, Word } from "@/types/transcript-types";
import React, { memo } from "react";
import WordItem from "../player-container/word-item";
import EditMenu from "./edit-menu";
import EditPreview from "./edit-preview";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranscript } from "@/stores/transcript-store";
import { updateEdit } from "@/api/project";
import { useProjects } from "@/stores/projects-store";
import { Jost } from "next/font/google";
import { cn, formatDuration } from "@/lib/utils";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface EditItemProps {
  edit: Edit;
  active: boolean;
  onClick?: (edit: Edit) => void;
  onDelete: (id: string) => void;
}

const EditItem = ({ edit, onClick, onDelete, active }: EditItemProps) => {
  const { edits, setEdits } = useTranscript();
  const { currentProject } = useProjects();

  return (
    <motion.div
      className={`my-4 flex items-start gap-x-4 cursor-pointer rounded-md p-2 border border-dashed ${active ? "border-slate-400" : "border-transparent hover:border-gray-300"} transition group relative`}
      onClick={(e) => {
        if (onClick) {
          onClick(edit);
        }
      }}
    >
      <EditPreview
        id={edit.id}
        start={edit.words[0].start}
        end={edit.words[edit.words.length - 1].end}
      />

      <div className="flex flex-col gap-y-0.5 flex-1 relative">
        <div className="flex items-start justify-between">
          <p
            className={cn(
              "line-clamp-2 mr-4 flex-1 text-base font-medium outline-none pr-4",
              jostFont.className
            )}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const text = e.target.textContent;
              if (!text?.trim()) {
                e.target.textContent = edit.title;
                toast.error("Title is required!");
              } else {
                edit.title = e.target.textContent!;
                setEdits(edits || []);
                updateEdit(currentProject?.id!, edits || []);
              }
            }}
          >
            {edit.title}
          </p>

          <p
            className={cn(
              "text-[12px] text-muted-foreground pr-3 ",
              jostFont.className
            )}
          >
            {formatDuration(edit.words[0].start / 1000)} -{" "}
            {formatDuration(edit.words[edit.words.length - 1].end / 1000)}
          </p>
        </div>

        <div className="flex-1 text-wrap">
          {edit.words?.map((word: Word) => {
            return (
              <WordItem
                key={word.id}
                word={word}
                className={`text-sm text-muted-foreground edit-word ${edit.id}`}
              />
            );
          })}
        </div>
      </div>

      <EditMenu
        onDeleteClick={(e) => {
          e.stopPropagation();
          onDelete(edit.id);
        }}
      />
    </motion.div>
  );
};

export default memo(EditItem);
