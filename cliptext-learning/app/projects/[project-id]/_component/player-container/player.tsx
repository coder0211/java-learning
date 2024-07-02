/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { useProjects } from "@/stores/projects-store";
import { Kind } from "@/types/project-types";

interface PlayerProps {
  onExpand: boolean;
  currentTime?: number;
  setCurrentTime: (time: number) => void;
}

const Player = ({ onExpand, currentTime, setCurrentTime }: PlayerProps) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const { currentProject } = useProjects();
  const { objectUrl, setMediaRefCurrent } = useMediaPlayerRef();

  const trackingNoRenderState = useMemo<{
    frameCallbackId: any | undefined;
    currentWord: HTMLSpanElement | undefined;
  }>(() => {
    return { frameCallbackId: undefined, currentWord: undefined };
  }, []);

  useEffect(() => {
    if (objectUrl) {
      mediaRef.current?.load();
    }
  }, [objectUrl]);

  useEffect(() => {
    const words = document.querySelectorAll(".word");
    if (trackingNoRenderState.currentWord) {
      trackingNoRenderState.currentWord.classList.remove("bg-blue-600");
      trackingNoRenderState.currentWord.classList.remove("text-white");
      trackingNoRenderState.currentWord.classList.remove("current-word");
    }
    for (let i = 0; i < words.length; i++) {
      const start = parseInt(words[i].getAttribute("data-start")!);
      const end = parseInt(words[i].getAttribute("data-end")!);
      if (
        currentTime &&
        currentTime >= start / 1000 &&
        currentTime <= end / 1000
      ) {
        words[i].classList.add("bg-blue-600");
        words[i].classList.add("text-white");
        words[i].classList.add("current-word");
        trackingNoRenderState.currentWord = words[i] as HTMLSpanElement;
        break;
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (mediaRef.current) {
      setMediaRefCurrent(mediaRef.current);
    }
  }, [setCurrentTime, setMediaRefCurrent]);

  useEffect(() => {
    return () => {
      clearInterval(trackingNoRenderState.frameCallbackId);
    };
  }, []);

  return (
    <div className="w-full relative">
      <motion.div
        animate={{
          height: `${!onExpand && currentProject?.kind === Kind.Video ? "250px" : "auto"}`,
        }}
        className={`flex items-start gap-x-4 w-full`}
      >
        {currentProject?.kind === Kind.Video && (
          <video
            id="media-player"
            className={`bg-slate-200 w-full h-full aspect-[16/9] object-container ${onExpand ? "rounded-md" : "rounded-sm"}`}
            controls={true}
            ref={mediaRef}
            onPlay={(e) => {
              trackingNoRenderState.frameCallbackId = setInterval(
                () => {
                  setCurrentTime(mediaRef.current?.currentTime ?? 0);
                },
                (1 / 24) * 1000
              );
            }}
            onPause={() => {
              clearInterval(trackingNoRenderState.frameCallbackId);
            }}
          >
            <source src={objectUrl} />
          </video>
        )}

        {currentProject?.kind === Kind.Audio && (
          <audio
            id="media-player"
            className={`w-full`}
            controls={true}
            ref={mediaRef}
            onPlay={(e) => {
              trackingNoRenderState.frameCallbackId = setInterval(
                () => {
                  setCurrentTime(mediaRef.current?.currentTime ?? 0);
                },
                (1 / 24) * 1000
              );
            }}
            onPause={() => {
              clearInterval(trackingNoRenderState.frameCallbackId);
            }}
          >
            <source src={objectUrl} />
          </audio>
        )}
      </motion.div>
    </div>
  );
};

export default Player;
