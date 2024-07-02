import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Transcript from "./transcript";
import Player from "./player";
import Chapters from "./chapter";
import { memo, useState } from "react";
import TranscriptMenu from "./transcript-menu";

import TranscriptActionBar from "./transcript-action-bar";
import { useGlobalToggleState } from "@/stores/global-toggle-state-store";

interface PlayerContainerRef {
  setCurrentTime: (time: number) => void;
  currentTime?: number;
}

const PlayerContainer = ({
  setCurrentTime,
  currentTime,
}: PlayerContainerRef) => {
  const { onExpand } = useGlobalToggleState();
  const [currentTab, setCurrentTab] = useState("transcript");

  return (
    <div className="flex-1 bg-white flex flex-col gap-y-4 h-full pl-6 py-6 ">
      <Player
        onExpand={onExpand}
        setCurrentTime={setCurrentTime}
        currentTime={currentTime}
      />

      <Tabs
        defaultValue={"transcript"}
        className="w-full flex-1 flex flex-col items-start "
      >
        <div className="flex items-center justify-between py-4 w-full">
          <TabsList>
            <TabsTrigger
              value="transcript"
              onClick={() => {
                setCurrentTab("transcript");
              }}
            >
              Transcript
            </TabsTrigger>
            <TabsTrigger
              value="chapters"
              onClick={() => {
                setCurrentTab("chapters");
              }}
            >
              Summary
            </TabsTrigger>
          </TabsList>

          <TranscriptActionBar currentTab={currentTab} />
        </div>

        <TabsContent value="transcript" className="w-full h-full flex-1">
          <Transcript />
        </TabsContent>

        <TabsContent value="chapters" className="w-full h-full flex-1">
          <Chapters />
        </TabsContent>
      </Tabs>

      <TranscriptMenu />
    </div>
  );
};

export default memo(PlayerContainer);
