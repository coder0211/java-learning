import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Youtube } from "lucide-react";
import YoutubeUploadForm from "./youtube-upload-form";
import LocalUploadForm from "./local-upload-form";
import { useCreateProjectModal } from "@/stores/create-project-modal-store";
import { UploadType } from "@/types/project-types";

import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

const CreateProjectModal = () => {
  let toastIsOpen = false;

  const debounceToast = useDebounceCallback(() => {
    toastIsOpen = false;
  }, 500);

  const {
    isOpen,
    isCreating,
    uploadType: type,
    setOpen,
  } = useCreateProjectModal();

  return (
    <>
      <Dialog
        defaultOpen={false}
        open={isOpen}
        onOpenChange={(e) => {
          if (isCreating) {
            if (!toastIsOpen) {
              toast.info(
                "Your clip is being uploaded, please wait a bit thanks."
              );
              toastIsOpen = true;
            } else {
              debounceToast();
            }
          } else {
            setOpen(e);
          }
        }}
      >
        <DialogContent>
          <Tabs defaultValue="local" className="w-full h-full">
            <TabsList className="mb-6">
              <TabsTrigger
                value="local"
                disabled={isCreating && type !== UploadType.Local}
              >
                <Upload className="w-4 h-4 mr-2 fill-white" /> Local
              </TabsTrigger>
              <TabsTrigger
                value="youtube"
                // disabled={isCreating && type !== UploadType.Youtube}
                disabled
              >
                <Youtube className="w-4 h-4 mr-2 fill-white stroke-rose-500" />
                Youtube
              </TabsTrigger>
            </TabsList>
            <TabsContent value="local">
              <LocalUploadForm />
            </TabsContent>

            <TabsContent value="youtube">
              <YoutubeUploadForm />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateProjectModal;
