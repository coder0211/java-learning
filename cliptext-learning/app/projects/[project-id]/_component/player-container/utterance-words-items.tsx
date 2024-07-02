import { cn, formatDuration, getSelectedSpanIds } from "@/lib/utils";
import { Word } from "@/types/transcript-types";
import { Jost } from "next/font/google";
import React, { useCallback, useMemo, useState } from "react";
import WordItem from "./word-item";
import { useTranscript } from "@/stores/transcript-store";
import { useSelection } from "@/stores/selection-store";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useGlobalToggleState } from "@/stores/global-toggle-state-store";
import { toast } from "sonner";
import { updateUtterances, updateWords } from "@/api/project";
import { useProjects } from "@/stores/projects-store";

const jostFont = Jost({
  subsets: ["latin"],
  weight: "400",
});

interface UtteranceWordsItemProps {
  handledUtterance: any;
}

const UtteranceWordsItem = ({ handledUtterance }: UtteranceWordsItemProps) => {
  const {
    words: transcriptWords,
    utterances,
    setWords,
    setUtterances,
  } = useTranscript();
  const { onTranscriptEditMode } = useGlobalToggleState();
  const { mediaRefCurrent } = useMediaPlayerRef();
  const { currentProject } = useProjects();
  const { setSelectionRect, setSelectionMenuVisible, setSelectionWords } =
    useSelection();

  const trackingNoRenderState = useMemo(() => {
    return {
      selectedText: "",
    };
  }, []);

  const onClickWord = useCallback(
    (word: Word) => {
      if (mediaRefCurrent) {
        mediaRefCurrent.currentTime = word.start / 1000;
      }
    },
    [mediaRefCurrent]
  );

  const onMouseUp = useCallback(() => {
    const activeSelection = document.getSelection();
    if (activeSelection?.anchorNode?.parentElement?.tagName != "SPAN") {
      return;
    }
    if (
      activeSelection?.isCollapsed ||
      activeSelection?.toString() === trackingNoRenderState.selectedText
    ) {
      setSelectionMenuVisible(false);
      setSelectionWords([]);
      setSelectionRect(undefined);
      activeSelection.removeAllRanges();
      trackingNoRenderState.selectedText = "";
      return;
    }
    trackingNoRenderState.selectedText = activeSelection?.toString()!;
    const ids = getSelectedSpanIds();
    const selectionWords = transcriptWords?.filter((word) =>
      ids.includes(word.id)
    );
    setSelectionWords(selectionWords);
    setSelectionMenuVisible(true);
    setSelectionRect(
      activeSelection?.focusNode?.parentElement?.getBoundingClientRect()
    );
  }, [
    setSelectionMenuVisible,
    setSelectionRect,
    setSelectionWords,
    trackingNoRenderState,
    transcriptWords,
  ]);

  const onEditWordBlur = useCallback(
    async (
      utteranceId: string,
      e: React.FocusEvent<HTMLSpanElement, Element>,
      word: Word
    ) => {
      const content = e.target.textContent?.trim() ?? "";
      if (!content) {
        e.target.textContent = word.text;
        toast.error("Doesn't allow empty word!");
      } else {
        const foundedWord = transcriptWords?.find(
          (item) => item.id === word.id
        );
        const foundedUtteranceWord = utterances
          ?.find((item) => item.id === utteranceId)
          ?.words?.find((item) => item.id === word.id);

        try {
          if (foundedWord && foundedUtteranceWord) {
            foundedWord.text = content;
            foundedUtteranceWord.text = content;

            setWords(transcriptWords ?? []);
            setUtterances(utterances ?? []);
            updateWords(currentProject?.id!, transcriptWords ?? []);
            updateUtterances(currentProject?.id!, utterances ?? []);
          }
        } catch (e) {
          toast.error(
            "Couldn't update words, please try again or contact support!"
          );
        }
      }
    },
    [currentProject?.id, setUtterances, setWords, transcriptWords, utterances]
  );

  const renderedUtterances = useMemo(() => {
    return handledUtterance?.words?.map((words: Word[], idx: number) => {
      const startMs = words[0]?.start;
      return (
        <div
          key={idx}
          className="pl-[150px] flex gap-x-4 w-full"
          onMouseUp={() => {
            if (!onTranscriptEditMode) {
              onMouseUp();
            }
          }}
        >
          <p
            className={cn(
              "text-sm text-muted-foreground w-[48px] select-none leading-7 pointer-events-none",
              jostFont.className
            )}
          >
            {formatDuration(startMs / 1000)}
          </p>

          <div className="flex-1 text-wrap pr-8">
            {words?.map((word: Word) => {
              return (
                <WordItem
                  key={word.id}
                  word={word}
                  onClick={onClickWord}
                  className="word"
                  isEditable={onTranscriptEditMode}
                  onBlur={(e, word) => {
                    onEditWordBlur(handledUtterance.id, e, word);
                  }}
                />
              );
            })}
          </div>
        </div>
      );
    });
  }, [
    handledUtterance.id,
    handledUtterance?.words,
    onClickWord,
    onEditWordBlur,
    onMouseUp,
    onTranscriptEditMode,
  ]);

  return <>{renderedUtterances}</>;
};

export default UtteranceWordsItem;
