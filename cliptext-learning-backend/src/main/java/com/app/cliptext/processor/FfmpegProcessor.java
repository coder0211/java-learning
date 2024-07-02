package com.app.cliptext.processor;

import com.app.cliptext.util.FileHandlerUtil;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

public class FfmpegProcessor {

    private static final Logger log = LoggerFactory.getLogger(FfmpegProcessor.class);
    private final CommandProcessor commandProcessor;
    private final DecimalFormat df = new DecimalFormat("#.####");

    public FfmpegProcessor() {
        commandProcessor = new CommandProcessor();
    }

    public String transcodeToAAC(String id, String input) throws Exception {
        try {
            log.info("[{}] Start creating acc audio file...", id);
            String output = "upload/" + id + "/" + "audio.aac";
            commandProcessor.execute(id, List.of("ffmpeg", "-y", "-i", input,
                    "-codec:a", "aac",
                    "-b:a", "320k",
                    output));
            log.info("[{}] Created acc audio file successfully!", id);
            return output;
        } catch (Exception e) {
            log.error("[{}] Failed to create acc audio file!", id);
            throw new Exception(e);
        }

    }

    public String createThumbnail(String id, String input) throws Exception {
        try {
            log.info("[{}] Start creating thumbnail...", id);
            String output = "upload/" + id + "/" + "thumbnail.jpg";
            commandProcessor.execute(id, List.of("ffmpeg", "-y",
                    "-ss", "5",
                    "-i", input,
                    "-frames:v", "1",
                    "-qscale:v", "2",
                    output));
            log.info("[{}] Created thumbnail successfully!", id);
            return output;
        } catch (Exception e) {
            log.error("[{}] Failed to create thumbnail!", id);
            throw new Exception(e);
        }
    }

    public String split(String id, String filename, Double start, Double end) throws Exception {
        try {
            log.info("[{}] Start splitting video...", id);
            String input = "upload/" + id + "/" + filename;
            String startTime = df.format(start);
            String endTime = df.format(end);
            String[] splitFilename = filename.split("\\.");
            String output = "upload/" + id + "/" + "split_from_" + startTime.replaceAll("\\.", "_") + "_to_" + endTime.replaceAll("\\.", "_") + "." + splitFilename[splitFilename.length - 1];

            if (new File(output).exists()) {
                return output;
            }

            commandProcessor.execute(id, List.of("ffmpeg", "-y",
                    "-ss", startTime,
                    "-i", input,
                    "-t", df.format(end - start),
                    output));
            log.info("[{}] Split video successfully!", id);
            return output;
        } catch (Exception e) {
            log.error("[{}] Failed to split video!", id);
            throw new Exception(e);
        }
    }

    public String exportToMP4(String id, String input) throws IOException {
        String output = "upload/" + id + "/" + "export.mp4";
        log.info("[{}] Start exporting mp4...", id);

        List<String> commands = new ArrayList<>();
        commands.add("ffmpeg");
        commands.add("-y");

        String editsStr = FileUtils.readFileToString(new File(FileHandlerUtil.getUploadPath(id, "edits.json")), StandardCharsets.UTF_8);
        JSONArray edits = new JSONArray(editsStr);

        for (var edit : edits) {
            JSONObject editJson = (JSONObject) edit;
            JSONArray editWords = (JSONArray) editJson.get("words");
            Integer start = (Integer) ((JSONObject) editWords.get(0)).get("start");
            Integer end = (Integer) ((JSONObject) editWords.get(editWords.length() - 1)).get("end");
            int duration = end - start;
            commands.add("-ss");
            commands.add(String.valueOf(Double.parseDouble(String.valueOf((double) start / 1000))));
            commands.add("-t");
            commands.add(String.valueOf(Double.parseDouble(String.valueOf((double) duration / 1000))));
            commands.add("-i");
            commands.add(input);
        }

        commands.add("-filter_complex");
        StringBuilder filters = new StringBuilder();
        StringBuilder maps = new StringBuilder();
        for (int i = 0; i < edits.length(); i++) {
            filters.append("[" + i + ":v:0]scale=" + 1920 + ":" + 1080 + ":force_original_aspect_ratio=decrease,pad=" + 1920 + ":" + 1080 + ":(ow-iw)/2:(oh-ih)/2,setsar=1[Scaled_" + i + "];");
            maps.append("[Scaled_" + i + "][" + i + ":a:0]");
        }
        String completeFilters = filters + maps.toString() + "concat=n=" + edits.length() + ":v=1:a=1[Merged]";
        commands.add(completeFilters);
        commands.add("-map");
        commands.add("[Merged]");
        commands.add("-r");
        commands.add("24");

        commands.add(output);

        commandProcessor.execute(id, commands);

        log.info("[{}] Exported mp4 audio file successfully!", id);
        return output;
    }


    public String exportToMP3(String id, String input) throws IOException {
        String output = "upload/" + id + "/" + "export.mp3";
        log.info("[{}] Start exporting mp3...", id);

        List<String> commands = new ArrayList<>();
        commands.add("ffmpeg");
        commands.add("-y");

        String editsStr = FileUtils.readFileToString(new File(FileHandlerUtil.getUploadPath(id, "edits.json")), StandardCharsets.UTF_8);
        JSONArray edits = new JSONArray(editsStr);

        for (var edit : edits) {
            JSONObject editJson = (JSONObject) edit;
            JSONArray editWords = (JSONArray) editJson.get("words");
            Integer start = (Integer) ((JSONObject) editWords.get(0)).get("start");
            Integer end = (Integer) ((JSONObject) editWords.get(editWords.length() - 1)).get("end");
            int duration = end - start;
            commands.add("-ss");
            commands.add(String.valueOf(Double.parseDouble(String.valueOf((double) start / 1000))));
            commands.add("-t");
            commands.add(String.valueOf(Double.parseDouble(String.valueOf((double) duration / 1000))));
            commands.add("-i");
            commands.add(input);
        }

        commands.add("-filter_complex");
        StringBuilder maps = new StringBuilder();
        for (int i = 0; i < edits.length(); i++) {
            maps.append("[" + i + ":a]");
        }
        String completeFilters = maps + "concat=n=" + edits.length() + ":v=0:a=1";
        commands.add(completeFilters);
        commands.add(output);

        commandProcessor.execute(id, commands);

        log.info("[{}] Exported mp3 audio file successfully!", id);
        return output;
    }
}
