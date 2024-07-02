import { useTranscript } from "@/stores/transcript-store";
import { Chapter } from "@/types/transcript-types";
import ChapterItem from "./chapter-item";
import { memo, useEffect, useState } from "react";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { Virtuoso } from "react-virtuoso";
import { useGlobalSearch } from "@/stores/global-search-store";

const Chapters = () => {
  const { chapters } = useTranscript();
  const [handledChapters, setHandledChapters] = useState(chapters);
  const { mediaRefCurrent } = useMediaPlayerRef();
  const { searchValue, searchType } = useGlobalSearch();

  useEffect(() => {
    setHandledChapters(chapters);
  }, [chapters]);

  useEffect(() => {
    if (searchType === "chapters") {
      const search = searchValue?.toLocaleLowerCase() || "";
      setHandledChapters(() =>
        chapters?.filter(
          (chapter) =>
            chapter.summary?.toLowerCase()?.includes(search) ||
            chapter.headline?.toLowerCase()?.includes(search) ||
            chapter.gist?.toLowerCase()?.includes(search)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className="w-full h-full flex flex-col gap-y-4 mt-7 pb-12">
      <Virtuoso
        className="w-full h-full gap-y-4"
        data={handledChapters}
        itemContent={(index, chapter) => {
          return (
            <div key={chapter.id} className="py-2">
              <ChapterItem
                chapter={chapter}
                onClick={(chapter: Chapter) => {
                  if (mediaRefCurrent) {
                    mediaRefCurrent.currentTime = chapter.start / 1000;
                  }
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default memo(Chapters);
