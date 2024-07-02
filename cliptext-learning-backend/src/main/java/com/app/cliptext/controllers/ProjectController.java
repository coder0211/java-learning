package com.app.cliptext.controllers;

import com.app.cliptext.entities.Project;
import com.app.cliptext.processor.FfmpegProcessor;
import com.app.cliptext.services.ProjectService;
import com.app.cliptext.util.FileHandlerUtil;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.io.FileUtils;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    private final ProjectService projectService;
    private final FfmpegProcessor ffmpegProcessor = new FfmpegProcessor();

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("id") String id, @RequestPart("file") MultipartFile file, @RequestHeader(name = "FILENAME") String filename) throws IOException {
        if (!file.isEmpty()) {
            String folder = "upload/" + id;
            Path filePath = Paths.get(folder + "/" + filename);
            Files.createDirectories(filePath.getParent());
            byte[] bytes = file.getBytes();

            if (Files.exists(filePath)) {
                Files.write(filePath, bytes, StandardOpenOption.APPEND);
            } else {
                Files.write(filePath, bytes, StandardOpenOption.CREATE);
            }
            return ResponseEntity.ok(filePath.toString());
        }
        return new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/upload/cancel")
    public ResponseEntity<String> cancelUpload(@RequestParam("id") String id, @RequestHeader(name = "FILENAME") String filename) throws IOException {
        String folder = "upload/" + id;
        Path filePath = Paths.get(folder + "/" + filename);
        Files.deleteIfExists(filePath);
        Files.deleteIfExists(Paths.get(folder));
        return ResponseEntity.ok("Ok");
    }

    @PostMapping
    public ResponseEntity<String> save(@RequestBody Project project) {
        String projectId = projectService.save(project);
        return ResponseEntity.ok(projectId);
    }

    @GetMapping
    public ResponseEntity<List<Project>> listByUserId(@RequestHeader("USER-ID") String userId) {
        return ResponseEntity.ok(projectService.listByUserId(userId));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<List<Project>> listByRoomId(@PathVariable(name = "roomId") String roomId) {
        return ResponseEntity.ok(projectService.listByRoomId(roomId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable(name = "id") String id) {
        Project project = projectService.getProjectById(id);
        if (project == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(project);
    }

    @GetMapping("/{id}/data")
    public ResponseEntity<String> getTranscriptDataById(@PathVariable(name = "id") String id) throws IOException {
        String wordsStr = FileUtils.readFileToString(new File(FileHandlerUtil.getUploadPath(id, "words.json")), StandardCharsets.UTF_8);
        String utterancesStr = FileUtils.readFileToString(new File(FileHandlerUtil.getUploadPath(id, "utterances.json")), StandardCharsets.UTF_8);
        String chaptersStr = FileUtils.readFileToString(new File(FileHandlerUtil.getUploadPath(id, "chapters.json")), StandardCharsets.UTF_8);
        String speakersStr = FileUtils.readFileToString(new File(FileHandlerUtil.getUploadPath(id, "speakers.json")), StandardCharsets.UTF_8);
        String editsStr = FileUtils.readFileToString(new File(FileHandlerUtil.getUploadPath(id, "edits.json")), StandardCharsets.UTF_8);
        JsonElement words = JsonParser.parseString(wordsStr);
        JsonElement utterances = JsonParser.parseString(utterancesStr);
        JsonElement chapters = JsonParser.parseString(chaptersStr);
        JsonElement speakers = JsonParser.parseString(speakersStr);
        JsonElement edits = JsonParser.parseString(editsStr);

        JsonObject data = new JsonObject();
        data.add("words", words);
        data.add("utterances", utterances);
        data.add("chapters", chapters);
        data.add("speakers", speakers);
        data.add("edits", edits);
        return ResponseEntity.ok(data.toString());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") String id) {
        projectService.deleteById(id);
        return ResponseEntity.ok("Ok");
    }

    @PutMapping("/name/{id}")
    public ResponseEntity<String> update(@PathVariable("id") String id, @RequestBody Project project) {
        projectService.updateName(id, project.getName());
        return ResponseEntity.ok("Ok");
    }

    @PutMapping("/{id}/edits")
    public ResponseEntity<String> updateEdits(@PathVariable("id") String id, @RequestBody String edits) {
        JSONObject jsonObject = new JSONObject(edits);
        FileHandlerUtil.writeJSON(jsonObject.get("edits").toString(), FileHandlerUtil.getUploadPath(id, "edits.json"));
        return ResponseEntity.ok("Ok");
    }

    @PutMapping("/{id}/speaker")
    public ResponseEntity<String> updateSpeaker(@PathVariable("id") String id, @RequestBody String edits) {
        JSONObject jsonObject = new JSONObject(edits);
        FileHandlerUtil.writeJSON(jsonObject.get("speaker").toString(), FileHandlerUtil.getUploadPath(id, "speakers.json"));
        return ResponseEntity.ok("Ok");
    }

    @PutMapping("/{id}/words")
    public ResponseEntity<String> updateWords(@PathVariable("id") String id, @RequestBody String words) {
        JSONObject jsonObject = new JSONObject(words);
        FileHandlerUtil.writeJSON(jsonObject.get("words").toString(), FileHandlerUtil.getUploadPath(id, "words.json"));
        return ResponseEntity.ok("Ok");
    }

    @PutMapping("/{id}/chapters")
    public ResponseEntity<String> updateChapters(@PathVariable("id") String id, @RequestBody String chapters) {
        JSONObject jsonObject = new JSONObject(chapters);
        FileHandlerUtil.writeJSON(jsonObject.get("chapters").toString(), FileHandlerUtil.getUploadPath(id, "chapters.json"));
        return ResponseEntity.ok("Ok");
    }

    @PutMapping("/{id}/utterances")
    public ResponseEntity<String> updateUtterances(@PathVariable("id") String id, @RequestBody String utterances) {
        JSONObject jsonObject = new JSONObject(utterances);
        FileHandlerUtil.writeJSON(jsonObject.get("utterances").toString(), FileHandlerUtil.getUploadPath(id, "utterances.json"));
        return ResponseEntity.ok("Ok");
    }

    @PostMapping("/{id}/export-mp4")
    public ResponseEntity<String> exportMP4(@PathVariable("id") String id, @RequestParam("input") String input) throws IOException {
        String output = ffmpegProcessor.exportToMP4(id, input);
        return ResponseEntity.ok(output);
    }

    @PostMapping("/{id}/export-mp3")
    public ResponseEntity<String> exportMP3(@PathVariable("id") String id, @RequestParam("input") String input) throws IOException {
        String output = ffmpegProcessor.exportToMP3(id, input);
        return ResponseEntity.ok(output);
    }

}
