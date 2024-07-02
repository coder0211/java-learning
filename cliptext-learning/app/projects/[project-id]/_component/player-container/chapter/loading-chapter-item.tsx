import { formatDuration } from "@/lib/utils";
import { useProjects } from "@/stores/projects-store";
import { Kind } from "@/types/project-types";
import { Chapter } from "@/types/transcript-types";
import { Clapperboard, Headphones } from "lucide-react";
import React from "react";

interface LoadingChapterItemProps {
  chapter: Chapter;
}

const LoadingChapterItem = ({ chapter }: LoadingChapterItemProps) => {
  const { currentProject } = useProjects();

  return (
    <div className="w-[150px] aspect-[16/9] bg-slate-800 relative">
      {currentProject?.kind === Kind.Audio && (
        <Headphones className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
      )}

      {currentProject?.kind === Kind.Video && (
        <Clapperboard className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
      )}

      <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center opacity-100 transition gap-y-4">
        <span className="flex items-center justify-center px-2 py-1 rounded-md bg-black/50 text-white text-[12px]">
          {formatDuration((chapter.end - chapter.start) / 1000)}
        </span>
      </div>
    </div>
  );
};

export default LoadingChapterItem;
