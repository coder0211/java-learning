import { updateEdit } from "@/api/project";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/stores/projects-store";
import { useSelection } from "@/stores/selection-store";
import { useTranscript } from "@/stores/transcript-store";
import { Clapperboard } from "lucide-react";
import React, { memo, useCallback } from "react";
import { v4 as uuid } from "uuid";

const TranscriptMenu = () => {
  const {
    selectionMenuVisible,
    selectionRect,
    selectionWords,
    setSelectionMenuVisible,
    setSelectionWords,
    setSelectionRect,
  } = useSelection();
  const { edits, setEdits } = useTranscript();
  const { currentProject } = useProjects();

  const onCutClick = useCallback(() => {
    const edit = { id: uuid(), title: "Untitled", words: selectionWords || [] };
    let saveEdits = [edit];
    if (!edits) {
      setEdits(saveEdits);
    } else {
      saveEdits = [...edits, edit];
      setEdits(saveEdits);
    }
    updateEdit(currentProject?.id!, saveEdits);
    document.getSelection()?.removeAllRanges();
    setSelectionWords([]);
    setSelectionRect(undefined);
    setSelectionMenuVisible(false);
  }, [
    selectionWords,
    edits,
    currentProject?.id,
    setSelectionWords,
    setSelectionRect,
    setSelectionMenuVisible,
    setEdits,
  ]);

  return (
    <DropdownMenu
      open={selectionMenuVisible}
      onOpenChange={(e) => setSelectionMenuVisible(e)}
    >
      <DropdownMenuContent
        className="absolute flex w-auto gap-x-2 p-2 min-w-[0px] bg-white"
        style={{
          top: `${selectionRect?.top! - 55}px`,
          left: `${selectionRect?.left! + selectionRect?.width! / 2}px`,
        }}
      >
        <Hint label="Create an Edit" align="center" side="top" sideOffset={10}>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={onCutClick}
            className="w-6 h-6"
          >
            <Clapperboard className="w-4 h-4" />
          </Button>
        </Hint>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(TranscriptMenu);
