import {
  Chapter,
  Edit,
  Speaker,
  Utterance,
  Word,
} from "@/types/transcript-types";
import { create } from "zustand";

interface ITranscript {
  words?: Word[];
  speakerMap?: Speaker;
  utterances?: Utterance[];
  chapters?: Chapter[];
  edits?: Edit[];

  setWords: (words: Word[]) => void;
  setSpeakerMap: (speakerMap: Speaker) => void;
  setUtterances: (utterances: Utterance[]) => void;
  setChapters: (chapters: Chapter[]) => void;
  setEdits: (edits?: Edit[]) => void;
  resetTranscript: () => void;
}

export const useTranscript = create<ITranscript>((set) => ({
  words: undefined,
  speakerMap: undefined,
  utterances: undefined,
  chapters: undefined,
  edits: undefined,

  setWords: (words: Word[]) => {
    set({ words });
  },
  setSpeakerMap: (speakerMap: Speaker) => {
    set({ speakerMap });
  },
  setUtterances: (utterances: Utterance[]) => {
    set({ utterances });
  },
  setChapters: (chapters: Chapter[]) => {
    set({ chapters });
  },
  setEdits: (edits?: Edit[]) => {
    {
      set({ edits: edits });
    }
  },

  resetTranscript: () => {
    set({
      words: undefined,
      speakerMap: undefined,
      utterances: undefined,
      chapters: undefined,
      edits: undefined,
    });
  },
}));
