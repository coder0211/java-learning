package com.app.cliptext.assembly.ai;

import com.app.cliptext.util.FileHandlerUtil;
import com.assemblyai.api.AssemblyAI;
import com.assemblyai.api.resources.transcripts.types.Chapter;
import com.assemblyai.api.resources.transcripts.types.Transcript;
import com.assemblyai.api.resources.transcripts.types.TranscriptOptionalParams;
import com.assemblyai.api.resources.transcripts.types.TranscriptUtterance;
import com.assemblyai.api.resources.transcripts.types.TranscriptWord;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AssemblyAIUtil {
    private final AssemblyAI aai = AssemblyAI.builder()
            .apiKey("_")
            .build();

    public Transcript transcribe(File file) throws IOException {
        var params = TranscriptOptionalParams.builder().languageDetection(true).speakerLabels(true).audioStartFrom(0).autoChapters(true).build();
        return aai.transcripts().transcribe(file, params);
    }

    public Transcript getTranscript(String transcriptId) {
        return aai.transcripts().get(transcriptId);
    }

    public void writeOrganizedTranscriptData(String id, Transcript transcript) {
        JSONObject speakersJson = generateSpeakersJson(transcript);
        JSONArray wordsJson = generateWordsJson(transcript);
        JSONArray utterancesJson = generateUtterancesJson(transcript, wordsJson);
        JSONArray chaptersJson = generateChaptersJson(transcript);
        JSONArray editsJson = new JSONArray();

        FileHandlerUtil.writeJSON(speakersJson.toString(), FileHandlerUtil.getUploadPath(id, "speakers.json"));
        FileHandlerUtil.writeJSON(wordsJson.toString(), FileHandlerUtil.getUploadPath(id, "words.json"));
        FileHandlerUtil.writeJSON(utterancesJson.toString(), FileHandlerUtil.getUploadPath(id, "utterances.json"));
        FileHandlerUtil.writeJSON(chaptersJson.toString(), FileHandlerUtil.getUploadPath(id, "chapters.json"));
        FileHandlerUtil.writeJSON(editsJson.toString(), FileHandlerUtil.getUploadPath(id, "edits.json"));
    }

    private JSONObject generateSpeakersJson(Transcript transcript) {
        JSONObject speakersJson = new JSONObject();
        List<TranscriptWord> words = transcript.getWords().orElseGet(ArrayList::new);
        for (TranscriptWord word : words) {
            String speaker = word.getSpeaker().orElse("Unknown");
            speakersJson.put(speaker, "Speaker " + speaker);
        }
        return speakersJson;
    }

    private JSONArray generateWordsJson(Transcript transcript) {
        List<TranscriptWord> words = transcript.getWords().orElseGet(ArrayList::new);
        JSONArray wordsJson = new JSONArray(words);
        for (var wordObj : wordsJson) {
            JSONObject wordJson = ((JSONObject) wordObj);
            String speaker = (String) wordJson.get("speaker");
            speaker = speaker.replaceAll("Optional\\[|]", "");

            wordJson.put("id", UUID.randomUUID().toString());
            wordJson.put("speaker", speaker);
        }
        return wordsJson;
    }

    private JSONArray generateUtterancesJson(Transcript transcript, JSONArray wordsJson) {
        List<TranscriptUtterance> utterances = transcript.getUtterances().orElseGet(ArrayList::new);
        JSONArray utterancesJson = new JSONArray(utterances);
        for(var utteranceObj : utterancesJson) {
            JSONObject utteranceJson = (JSONObject) utteranceObj;
            utteranceJson.put("id", UUID.randomUUID().toString());
            JSONArray utteranceWords = (JSONArray) utteranceJson.get("words");
            for(var wordObj : utteranceWords) {
                JSONObject wordJson = (JSONObject) wordObj;
                updateWordIdByStartAndEndTime(wordsJson, wordJson);
            }
        }
        return utterancesJson;
    }

    private JSONArray generateChaptersJson(Transcript transcript) {
        List<Chapter> chapters = transcript.getChapters().orElseGet(ArrayList::new);
        JSONArray chaptersJson = new JSONArray(chapters);
        for(var chapterObj : chaptersJson) {
            JSONObject chapterJson = (JSONObject) chapterObj;
            chapterJson.put("id", UUID.randomUUID().toString());
        }
        return chaptersJson;
    }

    private void updateWordIdByStartAndEndTime(JSONArray wordsJson, JSONObject wordObject) {
        for (var wordObj : wordsJson) {
            JSONObject wordJson = ((JSONObject) wordObj);
            long startTime = wordObject.getLong("start");
            long endTime = wordObject.getLong("end");

            if (startTime == wordJson.getLong("start") && endTime == wordJson.getLong("end")) {
                wordObject.put("id", wordJson.getString("id"));
                wordObject.put("speaker", wordJson.getString("speaker"));
            }
        }
    }

}
