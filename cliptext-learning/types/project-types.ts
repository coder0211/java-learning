export enum Kind {
  Audio = "AUDIO",
  Video = "VIDEO",
}

export enum UploadType {
  Local = "LOCAL",
  Youtube = "YOUTUBE",
}

export enum Status {
  Pending = "PENDING",
  Success = "SUCCESS",
  Fail = "FAIL",
}

export interface Project {
  id: string;
  kind: Kind;
  uploadType: UploadType;
  url: string;
  name: string;
  createdAt: number;
  authorId: string;
  authorName: string;
  status: Status;
  thumbnail?: string;
  duration: number;
  roomId: string;
}
