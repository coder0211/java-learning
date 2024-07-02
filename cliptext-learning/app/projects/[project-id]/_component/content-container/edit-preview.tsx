import { captureFrame, formatDuration } from "@/lib/utils";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useProjects } from "@/stores/projects-store";
import { Kind } from "@/types/project-types";
import { Headphones } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface EditPreviewProps {
  id: string;
  start: number;
  end: number;
}

const EditPreview = ({ id, start, end }: EditPreviewProps) => {
  const { objectUrl } = useMediaPlayerRef();
  const { currentProject } = useProjects();
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    if (objectUrl && currentProject?.kind === Kind.Video) {
      const projectPreviewContainer = JSON.parse(
        localStorage.getItem("projectPreviewContainer") || "{}"
      );
      const preview = projectPreviewContainer.edits[id];
      if (!preview) {
        captureFrame(objectUrl, start / 1000).then((result) => {
          setImageSrc(result);
          if (result) {
            projectPreviewContainer.edits[id] = result;
            localStorage.setItem(
              "projectPreviewContainer",
              JSON.stringify(projectPreviewContainer)
            );
          }
        });
      } else {
        setImageSrc(preview);
      }
    }
  }, [currentProject?.kind, id, objectUrl, start]);

  return (
    <div className="w-[150px] aspect-[16/9] bg-gray-800 rounded-sm relative">
      {imageSrc && currentProject?.kind === Kind.Video && (
        <Image
          src={imageSrc}
          alt="Chapter Preview"
          className="top-0 left-0 w-full aspect-[16/9] rounded-sm"
          fill
        />
      )}

      {currentProject?.kind === Kind.Audio && (
        <div className="w-full h-full flex items-center justify-center opacity-100 transition bg-blue-100 relative">
          <Headphones className="w-4 h-4 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      <div className="absolute bottom-2 right-2 flex flex-col items-center justify-center opacity-100 gap-y-4">
        <span className="flex items-center justify-center px-2 py-1 rounded-md bg-black/50 text-white text-[12px]">
          {formatDuration(end / 1000 - start / 1000)}
        </span>
      </div>
    </div>
  );
};

export default EditPreview;
