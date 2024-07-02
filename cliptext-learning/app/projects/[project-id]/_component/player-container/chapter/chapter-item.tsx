import { cn, formatDuration } from "@/lib/utils";
import { Chapter, Word } from "@/types/transcript-types";
import { Jost } from "next/font/google";
import React, { memo, useEffect, useState } from "react";
import LoadingChapterItem from "./loading-chapter-item";
import PreviewChapterItem from "./preview-chapter-item";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useTranscript } from "@/stores/transcript-store";
import { toast } from "sonner";
import { updateChapters } from "@/api/project";
import { useProjects } from "@/stores/projects-store";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface ChapterProps {
  chapter: Chapter;
  onClick?: (chapter: Chapter) => void;
}

const ChapterItem = ({ chapter, onClick }: ChapterProps) => {
  const { objectUrl } = useMediaPlayerRef();
  const { chapters, setChapters } = useTranscript();
  const { currentProject } = useProjects();

  return (
    <div
      className="flex gap-x-4 items-start cursor-pointer rounded-md border border-dashed border-transparent hover:border-gray-300 transition p-2"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick(chapter);
        }
      }}
    >
      {!objectUrl && <LoadingChapterItem chapter={chapter} />}

      {objectUrl && <PreviewChapterItem chapter={chapter} />}

      <div className="w-full flex flex-col gap-y-0.5 flex-1">
        <div className="flex gap-x-2">
          <p
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={cn(
              "line-clamp-2 pr-4 flex-1 outline-none",
              jostFont.className
            )}
            spellCheck={false}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!e.target.textContent?.trim()) {
                e.target.textContent = chapter.headline;
                toast.error("Title is required!");
              } else {
                chapter.headline = e.target.textContent;
                setChapters(chapters || []);
                updateChapters(currentProject?.id!, chapters || []);
              }
            }}
          >
            {chapter.headline}
          </p>
          <p
            className={cn(
              "text-[12px] text-muted-foreground pr-3 ",
              jostFont.className
            )}
          >
            {formatDuration(chapter.start / 1000)} -{" "}
            {formatDuration(chapter.end / 1000)}
          </p>
        </div>

        <p
          className={cn(
            "text-muted-foreground w-full pr-4 text-sm outline-none",
            jostFont.className
          )}
          spellCheck={false}
          contentEditable
          suppressContentEditableWarning
          onClick={(e) => {
            e.stopPropagation();
          }}
          onBlur={async (e) => {
            if (!e.target.textContent?.trim()) {
              e.target.textContent = chapter?.summary;
              toast.error("Summary must have content!");
            } else {
              chapter.summary = e.target.textContent;
              setChapters(chapters || []);
              updateChapters(currentProject?.id!, chapters || []);
            }
          }}
        >
          {chapter?.summary}
        </p>
      </div>
    </div>
  );
};

export default memo(ChapterItem);
