import React, { memo } from "react";
import UtteranceWordsItem from "./utterance-words-items";
import UtteranceItemSpeaker from "./utterance-item-speaker";

interface UtteranceItemProps {
  handledUtterance: any;
}

const UtteranceItem = ({ handledUtterance }: UtteranceItemProps) => {
  return (
    <div className="w-full flex items-start flex-col gap-x-4">
      <UtteranceItemSpeaker speaker={handledUtterance.speaker} />

      <div className="flex flex-col gap-y-4">
        <UtteranceWordsItem handledUtterance={handledUtterance} />
      </div>
    </div>
  );
};

export default memo(UtteranceItem);
