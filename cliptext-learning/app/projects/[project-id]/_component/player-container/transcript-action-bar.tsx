import Hint from "@/components/hint";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  exportChaptersToDocx,
  exportTranscriptToDocx,
} from "@/exports/exporter";
import { useGlobalSearch } from "@/stores/global-search-store";
import { useGlobalToggleState } from "@/stores/global-toggle-state-store";
import { useProjects } from "@/stores/projects-store";
import { useTranscript } from "@/stores/transcript-store";
import { Kind } from "@/types/project-types";
import { FileDown, MoveUp, Pencil } from "lucide-react";
import React, { useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

interface TranscriptActionBarProps {
  currentTab: string;
}

const TranscriptActionBar = ({ currentTab }: TranscriptActionBarProps) => {
  const { currentProject } = useProjects();
  const { chapters, utterances, speakerMap } = useTranscript();
  const { setSearchType, setSearchValue } = useGlobalSearch();
  const {
    onTranscriptEditMode: onEditMode,
    setOnTranscriptEditMode: setOnEditMode,
    onExpand,
    setOnExpand,
  } = useGlobalToggleState();
  const [debounceValue, setDebounceValue] = useDebounceValue("", 200);

  useEffect(() => {
    setSearchType(currentTab);
    setSearchValue(debounceValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, setSearchType, setSearchValue]);

  const onExportClick = () => {
    if (currentTab === "transcript") {
      exportTranscriptToDocx(utterances ?? [], speakerMap ?? {});
    } else {
      exportChaptersToDocx(chapters ?? []);
    }
  };

  return (
    <div className="flex items-center gap-x-4">
      {currentProject?.kind === Kind.Video && (
        <Hint label={`${onExpand ? "Shrink" : "Expand"}`}>
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation();
              setOnExpand(!onExpand);
            }}
          >
            <MoveUp
              className={`w-4 h-4 ${!onExpand ? "rotate-180" : "rotate-0"} transition-all ease-in-out duration-500`}
            />
          </Button>
        </Hint>
      )}

      <Hint label={`Edit mode`}>
        <Button
          size={"icon"}
          variant={onEditMode ? "default" : "outline"}
          onClick={(e) => {
            e.stopPropagation();
            setOnEditMode(!onEditMode);
          }}
        >
          <Pencil className={`w-4 h-4`} />
        </Button>
      </Hint>

      <SearchInput
        placeholder="transcript, speaker..."
        onChange={(e) => setDebounceValue(e.target.value)}
      />
      <Hint label="Export to Word">
        <Button
          size={"icon"}
          className="bg-blue-500 hover:bg-blue-600"
          onClick={onExportClick}
        >
          <FileDown className="w-4 h-4" />
        </Button>
      </Hint>
    </div>
  );
};

export default TranscriptActionBar;
