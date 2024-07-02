import React, { memo } from "react";

import UtterancesList from "./utterances-list";
import SpeakerPopup from "./speaker-popup";

interface TranscriptProps {}

const Transcript = ({}: TranscriptProps) => {
  return (
    <div className="h-full w-full mt-4 mx-3 flex flex-col gap-y-4 bg-white pt-4 pb-8 px-4 rounded-md flex-1">
      <UtterancesList />

      <SpeakerPopup />
    </div>
  );
};

export default memo(Transcript);
