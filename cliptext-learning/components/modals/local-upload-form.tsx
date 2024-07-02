"use client";

import { Button } from "@/components/ui/button";
import { CircleX, Clapperboard, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import { cancelUpload, save, upload } from "@/api/project";
import { toast } from "sonner";
import { Progress } from "../ui/progress";
import { useCreateProjectModal } from "@/stores/create-project-modal-store";
import { UploadType, Kind, Project, Status } from "@/types/project-types";
import { v4 as uuid } from "uuid";
import { useUser } from "@clerk/nextjs";

import { useProjects } from "@/stores/projects-store";
import { useRooms } from "@/stores/rooms-store";

const LocalUploadForm = () => {
  const [id] = useState(uuid());
  const [files, setFiles] = useState<FileList | null>();
  const [progress, setProgress] = useState(0);

  const { user } = useUser();
  const { currentRoom } = useRooms();
  const { isCreating, uploadType, setIsCreating, setOpen, setUploadType } =
    useCreateProjectModal();
  const { add } = useProjects();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cancelObject = useMemo(() => ({ isCancel: false }), []);

  const onClickOpenFile = () => {
    if (!fileInputRef?.current) {
      return;
    }
    const fileInput = fileInputRef?.current;
    fileInput.type = "file";
    fileInput.accept = "video/*, audio/*";
    const change = (e: any) => {
      const uploadFiles = (e.target as any).files;
      if (uploadFiles?.length) {
        setFiles((e.target as any).files);
      }
      fileInput.removeEventListener("change", change);
    };
    fileInput.addEventListener("change", change);
    fileInput.click();
  };

  const onClickOpenFileForDomNode = (e: any) => {
    const uploadFiles = (e.target as any).files;
    if (uploadFiles?.length) {
      setFiles((e.target as any).files);
    }
  };

  const onProgress = (progress: number) => {
    if (isCreating && cancelObject.isCancel) {
      throw new Error("cancel uploading");
    }
    setProgress(progress);
  };

  const onSuccess = async (filePath: string) => {
    try {
      const project: Project = {
        id: id,
        name: filePath.split("/").pop()!,
        uploadType: uploadType,
        kind: (videoRef.current as any).type?.startsWith("audio/")
          ? Kind.Audio
          : Kind.Video,
        url: filePath,
        createdAt: Date.now(),
        authorId: user!.id,
        authorName: user!.fullName!,
        status: Status.Pending,
        duration: videoRef?.current?.duration!,
        roomId: currentRoom?.id!,
      };

      await save(project);
      add(project);
      setOpen(false);

      toast.success("Uploading successfully! Your clip is processing...");
      if (videoRef?.current?.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    } catch (e) {
      toast.error(
        "Could not save your project! Please try again or contact the supports, thanks."
      );
    }
  };

  const onError = (err: any) => {
    toast.error(
      "Oops! We have some troubles while uploading your file, please try again!"
    );
    console.log(err);
  };

  const onFinish = () => {
    setIsCreating(false);
    setProgress(0);
  };

  const onClickUpload = async () => {
    try {
      if (files?.length) {
        setIsCreating(true);
        setUploadType(UploadType.Local);
        await upload(files[0], id, onProgress, onSuccess, onError, onFinish);
        toast.info("Uploading your clip...");
      }
    } catch (e) {
      console.log(e);
      toast.error(
        "Couldn't upload your clip! Please try again or contact supports."
      );
    }
  };

  const onCancel = async () => {
    if (isCreating && files?.length) {
      cancelObject.isCancel = true;
      try {
        await cancelUpload(id, files[0].name);
        setIsCreating(false);
        toast.info("Canceled upload successfully!");
      } catch (e) {
        toast.error(
          "Something went wrong while canceling the upload! Please try again or contact supports."
        );
      }
    }
  };

  useEffect(() => {
    if (!videoRef?.current) {
      return;
    }

    if (files?.length) {
      if (videoRef.current.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }
      videoRef.current.src = URL.createObjectURL(files[0]);
      (videoRef.current as any).type = files[0].type;
      videoRef.current.load();
    }
  }, [files, videoRef]);

  return (
    <>
      {!files?.length && (
        <div
          onClick={onClickOpenFile}
          className="group border-[2px] border-dashed w-full h-[200px] rounded-md flex flex-col justify-center items-center cursor-pointer border-slate-300 hover:border-slate-400 transition"
        >
          <Clapperboard className="w-8 h-8 text-muted-foreground group-hover:text-slate-700 transition" />
          <p className="mt-6 text-muted-foreground group-hover:text-slate-700 transition">
            Drag or click your video here
          </p>
        </div>
      )}
      <Input
        type="file"
        accept="video/*, audio/*"
        className={`${files?.length ? "block" : "hidden"}`}
        ref={fileInputRef}
        disabled={isCreating}
        onChange={onClickOpenFileForDomNode}
      />
      {files != null && files.length > 0 && (
        <>
          <div className="mt-6 flex flex-col gap-x-2 w-full gap-y-4">
            <video
              controls
              className="w-full aspect-[16/9]"
              preload="metadata"
              autoPlay={false}
              ref={videoRef}
            />

            <div className="flex flex-col gap-y-2 items-center w-full">
              <Button
                className={`w-full ${isCreating ? "opacity-75 disabled:cursor-not-allowed" : ""}`}
                onClick={onClickUpload}
                disabled={isCreating}
              >
                {isCreating && (
                  <LoaderCircle className="mr-2 w-4 h-4 animate-spin" />
                )}
                {isCreating ? "Uploading..." : "Upload"}
              </Button>

              {isCreating && (
                <div className="flex gap-x-2 w-full items-center justify-between">
                  <Progress value={progress} className="w-full h-2 flex-1" />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LocalUploadForm;
