"use client";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowBigUp, Link2 } from "lucide-react";
import React, { ChangeEvent, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { useCreateProjectModal } from "@/stores/create-project-modal-store";

const YoutubeUploadForm = () => {
  const [value, setValue] = useDebounceValue("", 500);
  const { setOpen } = useCreateProjectModal();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClick = () => {
    toast.success("Start uploading your media...");
    setOpen(true);
  };

  useEffect(() => {
    if (!value) return;

    const youtubeId = getYouTubeId(value);

    if (!youtubeId) {
      toast.error("Youtube video url is not valid!");
      return;
    }
  }, [value]);

  return (
    <div className="w-full min-h-[200px] flex flex-col gap-y-4 relative">
      <div className="w-full relative">
        <Link2 className="w-4 h-4 absolute top-1/2 left-4 -translate-y-1/2" />
        <Input
          className="w-full pl-10"
          placeholder="Enter url here"
          onChange={onChange}
        />
      </div>

      {getYouTubeId(value) && (
        <div className="flex gap-x-2 flex-col gap-y-4">
          <iframe
            className="w-full  object-cover aspect-[16/9]"
            src={`https://www.youtube.com/embed/${getYouTubeId(value)}`}
            id="frame"
          ></iframe>

          <div className="flex flex-col gap-y-2 items-center w-full">
            <Button onClick={onClick} className="w-full">
              Upload
            </Button>
            {/* <ArrowBigUp className="w-5 h-5 animate-bounce" /> */}
          </div>
        </div>
      )}
    </div>
  );
};

function getYouTubeId(url: string) {
  // Regular expression pattern to match YouTube video URLs
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube embedded video URLs
  const embeddedRegex = /(?:embed|v)\/([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube short URLs
  const shortRegex =
    /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;

  // Regular expression pattern to match YouTube shorts URLs
  const shortsRegex =
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;

  // Check if the URL matches any of the patterns and extract the video ID
  const match =
    url.match(youtubeRegex) ||
    url.match(embeddedRegex) ||
    url.match(shortRegex) ||
    url.match(shortsRegex);

  // Return the video ID if found, otherwise return null
  return match ? match[1] : null;
}

export default YoutubeUploadForm;
