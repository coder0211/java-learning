import axios from "axios";

export async function createTranscript(assemblyKey: string, uploadFile: File) {
  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: assemblyKey,
    },
  });

  const uploadResponse = await assembly.post("/upload", uploadFile);
  const uploadURL = uploadResponse.data.upload_url;

  const response = await assembly.post("/transcript", {
    audio_url: uploadURL,
    speaker_labels: true,
    auto_chapters: true,
  });
  return response.data.id;
}
