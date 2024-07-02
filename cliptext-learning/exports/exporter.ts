import { exportMP3, exportMP4 } from "@/api/project";
import { SERVER_ENDPOINT } from "@/config/server-config";
import { formatDuration } from "@/lib/utils";
import { Chapter, Edit, Speaker, Utterance } from "@/types/transcript-types";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const exportChaptersToDocx = (chapters: Chapter[]) => {
  const paragraphs = [];

  for (const chapter of chapters ?? []) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: chapter.gist, bold: true }),
          new TextRun(
            ` | ${formatDuration(chapter.start / 1000)} - ${formatDuration(chapter.end / 1000)}`
          ),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Title: ", bold: true }),
          new TextRun(chapter.headline),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Summary: ", bold: true }),
          new TextRun(chapter.summary),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [new TextRun("\n")],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "chapters.docx");
    console.log("Document created successfully");
  });
};

export const exportTranscriptToDocx = (
  utterances: Utterance[],
  speakerMap: Speaker
) => {
  const paragraphs = [];

  for (const utterance of utterances) {
    const words = utterance.words.filter((word) => word.text?.trim());
    const start = words[0].start / 1000;
    const end = words[words.length - 1].end / 1000;

    const text = words.reduce((acc, word) => {
      return acc + " " + word.text;
    }, "");

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: speakerMap[utterance.speaker], bold: true }),
          new TextRun(` | ${formatDuration(start)} - ${formatDuration(end)}`),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [new TextRun(text)],
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [new TextRun("\n")],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "transcript.docx");
    console.log("Document created successfully");
  });
};

export const exportEditToDocx = (edits: Edit[]) => {
  const paragraphs = [];

  for (const edit of edits) {
    const words = edit.words.filter((word) => word.text?.trim());
    const start = words[0].start / 1000;
    const end = words[words.length - 1].end / 1000;

    const text = words.reduce((acc, word) => {
      return acc + " " + word.text;
    }, "");

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun(`${convertTimeString(formatDuration(end - start))} | `),
          new TextRun({ text: edit.title, bold: true }),
          new TextRun(` | ${formatDuration(start)} - ${formatDuration(end)}`),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [new TextRun(text)],
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [new TextRun("\n")],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "edits.docx");
    console.log("Document created successfully");
  });
};

function convertTimeString(timeString: string) {
  const parts = timeString.split(":").map(Number);

  let hours = 0,
    minutes = 0,
    seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  }

  let result = "";
  if (hours > 0) {
    result += `${hours}h`;
  }
  if (minutes > 0) {
    result += `${minutes}m`;
  }
  if (seconds > 0) {
    result += `${seconds}s`;
  }

  return result || "0s"; // Return '0s' if all components are zero
}

export const exportEditToMP4 = async (
  projectId: string,
  projectInput: string,
  projectName: string
) => {
  const output = await exportMP4(projectId, projectInput);
  const mediaResponse = await fetch(SERVER_ENDPOINT + "/" + output);
  const blobData = await mediaResponse.blob();
  saveAs(blobData, `${projectName}.mp4`);
};

export const exportEditToMP3 = async (
  projectId: string,
  projectInput: string,
  projectName: string
) => {
  const output = await exportMP3(projectId, projectInput);
  const mediaResponse = await fetch(SERVER_ENDPOINT + "/" + output);
  const blobData = await mediaResponse.blob();
  saveAs(blobData, `${projectName}.mp3`);
};
