import React, { memo, useEffect, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useSpeakerModifier } from "@/stores/speaker-modifier-store";
import { Input } from "@/components/ui/input";
import { useTranscript } from "@/stores/transcript-store";
import { toast } from "sonner";
import { updateSpeaker } from "@/api/project";
import { useProjects } from "@/stores/projects-store";

const SpeakerPopup = () => {
  const {
    currentSpeaker,
    currentSpeakerElement,
    setCurrentSpeakerElement,
    setCurrentSpeaker,
  } = useSpeakerModifier();
  const { currentProject } = useProjects();

  const { speakerMap, setSpeakerMap } = useTranscript();
  const [rect, setRect] = useState<DOMRect | undefined>(undefined);
  const [speakerName, setSpeakerName] = useState<string | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (speakerMap) {
      setSpeakerName(
        currentSpeaker ? speakerMap[currentSpeaker] : currentSpeaker
      );
    }
    setRect(currentSpeakerElement?.getBoundingClientRect());
  }, [currentSpeaker, currentSpeakerElement, speakerMap]);

  return (
    <Popover
      open={!!currentSpeakerElement}
      onOpenChange={(e) => {
        setCurrentSpeaker(undefined);
        setCurrentSpeakerElement(undefined);
      }}
    >
      <PopoverContent
        asChild
        style={{
          top: `${rect?.top! + rect?.height!}px`,
          left: `${rect?.left!}px`,
        }}
      >
        <div className="flex gap-x-4 w-[150px] absolute">
          <Input
            placeholder="Speaker..."
            value={speakerName}
            onChange={(e) => setSpeakerName(e.target.value)}
            disabled={isUpdating}
            onKeyUp={async (e) => {
              if (e.key === "Enter") {
                if (!speakerName?.trim()) {
                  toast.error("Speaker is not empty!");
                  return;
                }

                try {
                  if (speakerMap) {
                    setIsUpdating(true);
                    if (currentSpeaker) {
                      if (
                        speakerMap[currentSpeaker]?.trim() ===
                        speakerName?.trim()
                      ) {
                        setCurrentSpeaker(undefined);
                        setCurrentSpeakerElement(undefined);
                        return;
                      }
                      speakerMap[currentSpeaker] = speakerName;
                      await updateSpeaker(currentProject?.id!, speakerMap);
                      toast.success("Updating speaker successfully!");
                      setSpeakerMap(speakerMap);
                      setCurrentSpeaker(undefined);
                      setCurrentSpeakerElement(undefined);
                    }
                  }
                } finally {
                  setIsUpdating(false);
                }
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default memo(SpeakerPopup);
