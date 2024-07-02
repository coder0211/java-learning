"use client";

import React, { useEffect, useState } from "react";
import { getById, getDataById } from "@/api/project";
import Loading from "@/components/loading";
import { notFound } from "next/navigation";
import ContentContainer from "./_component/content-container";
import PlayerContainer from "./_component/player-container";
import { SERVER_ENDPOINT } from "@/config/server-config";
import { useProjects } from "@/stores/projects-store";
import { useTranscript } from "@/stores/transcript-store";
import { useMediaPlayerRender } from "@/stores/media-player-render-store";
import { useMediaPlayerRef } from "@/stores/media-player-ref-store";
import { captureFrame } from "@/lib/utils";
import { Kind } from "@/types/project-types";

interface ProjectPageProps {
  params: {
    "project-id": string;
  };
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const projectId = params["project-id"];
  const { currentProject, setCurrentProject } = useProjects();
  const {
    setWords,
    setSpeakerMap,
    setChapters,
    setUtterances,
    resetTranscript,
    setEdits,
  } = useTranscript();
  const { setCurrentTime, currentTime } = useMediaPlayerRender();
  const { objectUrl, setObjectUrl } = useMediaPlayerRef();

  const [notfound, setNotfound] = useState(false);
  const [onLoading, setOnLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setOnLoading(true);
        const response = await getById(projectId);
        const data = await getDataById(projectId);

        setCurrentProject(response);
        setWords(data.words);
        setUtterances(data.utterances);
        setChapters(data.chapters);
        setSpeakerMap(data.speakers);
        setEdits(data.edits);

        const mediaResponse = await fetch(SERVER_ENDPOINT + "/" + response.url);
        const blobData = await mediaResponse.blob();
        const objectBlobUrl = URL.createObjectURL(blobData);
        setObjectUrl(objectBlobUrl);

        if (response?.kind === Kind.Video) {
          const chapterPreviews: any = {};
          for (const chapter of data.chapters ?? []) {
            const result = await captureFrame(
              objectBlobUrl,
              chapter.start / 1000
            );
            if (result) {
              chapterPreviews[chapter.id] = result;
            }
          }

          const editPreviews: any = {};
          for (const edit of data.edits ?? []) {
            const result = await captureFrame(
              objectBlobUrl,
              edit?.words[0].start / 1000
            );
            if (result) {
              editPreviews[edit.id] = result;
            }
          }

          localStorage.setItem(
            "projectPreviewContainer",
            JSON.stringify({ chapters: chapterPreviews, edits: editPreviews })
          );
        }
      } catch (e) {
        setNotfound(true);
      } finally {
        setOnLoading(false);
      }
    };

    init();
  }, [
    projectId,
    setChapters,
    setCurrentProject,
    setEdits,
    setObjectUrl,
    setSpeakerMap,
    setUtterances,
    setWords,
  ]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        resetTranscript();
      }

      localStorage.removeItem("projectPreviewContainer");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (notfound) {
    notFound();
  }

  if (!currentProject) {
    return <Loading />;
  }

  if (onLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full gap-x-8">
        <PlayerContainer
          setCurrentTime={setCurrentTime}
          currentTime={currentTime}
        />
        <ContentContainer />
      </div>
    </div>
  );
};

export default ProjectPage;
