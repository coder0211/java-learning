import React, { memo, useEffect, useState } from "react";
import UtteranceItem from "./utterance-item";
import { useTranscript } from "@/stores/transcript-store";
import { Word } from "@/types/transcript-types";
import { Virtuoso } from "react-virtuoso";
import { useSpeakerModifier } from "@/stores/speaker-modifier-store";
import { useGlobalSearch } from "@/stores/global-search-store";

const UtterancesList = () => {
  const { utterances, speakerMap } = useTranscript();
  const [resultUtterances, setResultUtterances] = useState(utterances);
  const [handledUtterances, setHandleUtterances] = useState<any>();
  const [onLoading, setOnLoading] = useState(true);
  const { searchValue, searchType } = useGlobalSearch();

  const {
    setCurrentSpeaker,
    setCurrentSpeakerElement,
    currentSpeaker,
    currentSpeakerElement,
  } = useSpeakerModifier();

  useEffect(() => {
    setResultUtterances(utterances);
  }, [utterances]);

  useEffect(() => {
    try {
      setOnLoading(true);
      if (resultUtterances) {
        const results = [];
        for (const utterance of resultUtterances) {
          let groupWords: Word[][] = [];
          const handledUtterance = { ...utterance, words: groupWords };
          let words = [];
          for (const word of utterance?.words) {
            words.push(word);
            if (/[.!?]/.test(word.text)) {
              handledUtterance.words.push(words);
              words = [];
            }
          }
          if (words.length) {
            handledUtterance.words.push(words);
            words = [];
          }
          results.push(handledUtterance);
        }
        setHandleUtterances(results);
      }
    } finally {
      setOnLoading(false);
    }
  }, [resultUtterances]);

  useEffect(() => {
    if (searchType == "transcript") {
      const search = searchValue?.toLocaleLowerCase() || "";
      setResultUtterances((prev) =>
        utterances?.filter(
          (utterance) =>
            utterance.text?.toLowerCase()?.includes(search) ||
            (speakerMap ?? {})[utterance.speaker]
              ?.toLowerCase()
              ?.includes(search)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className="relative w-full h-full">
      {!onLoading && (
        <>
          {(handledUtterances?.length || 0) <= 0 && (
            <div className="flex flex-col items-center">
              <h2 className="text-muted-foreground">
                Does not have any transcript!
              </h2>
            </div>
          )}
          <Virtuoso
            className="w-full h-full gap-y-4"
            data={handledUtterances}
            onScroll={(e) => {
              if (currentSpeaker || currentSpeakerElement) {
                setCurrentSpeaker(undefined);
                setCurrentSpeakerElement(undefined);
              }
            }}
            itemContent={(index, utterance) => {
              return (
                <UtteranceItem
                  key={utterance?.id}
                  handledUtterance={utterance}
                />
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default memo(UtterancesList);
