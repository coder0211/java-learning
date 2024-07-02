export interface Speaker {
  [speakerKey: string]: string;
}

export interface Word {
  speaker: string;
  confidence: number;
  start: number;
  end: number;
  text: string;
  additionalProperties: any;
  id: string;
}

export interface Utterance {
  id: string;
  speaker: string;
  confidence: number;
  start: number;
  end: number;
  text: string;
  additionalProperties: any;
  words: Word[];
}

export interface Chapter {
  id: string;
  summary: string;
  gist: string;
  start: number;
  end: number;
  additionalProperties: any;
  headline: string;
}

export interface Edit {
  id: string;
  title: string;
  words: Word[];
}
