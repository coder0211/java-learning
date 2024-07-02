package com.app.cliptext.services;

import com.app.cliptext.assembly.ai.AssemblyAIUtil;
import com.app.cliptext.entities.Kind;
import com.app.cliptext.entities.Project;
import com.app.cliptext.entities.Status;
import com.app.cliptext.processor.FfmpegProcessor;
import com.app.cliptext.repository.ProjectRepository;
import com.assemblyai.api.resources.realtime.types.Word;
import com.assemblyai.api.resources.transcripts.types.Transcript;
import com.assemblyai.api.resources.transcripts.types.TranscriptWord;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import jakarta.annotation.PreDestroy;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectServiceImpl.class);
    private final ProjectRepository projectRepository;
    private final AssemblyAIUtil assemblyAIUtil;
    private final FfmpegProcessor ffmpegProcessor;

    private final ExecutorService executor;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
        this.assemblyAIUtil = new AssemblyAIUtil();
        this.ffmpegProcessor = new FfmpegProcessor();
        this.executor = Executors.newFixedThreadPool(8);
    }

    @Override
    public String save(Project project) {
        Project response = projectRepository.save(project);
        executor.execute(() -> {
            try {
                if(project.getKind().equals(Kind.VIDEO)) {
                    String thumbnailOutput = ffmpegProcessor.createThumbnail(project.getId(), project.getUrl());
                    projectRepository.updateThumbnail(project.getId(), thumbnailOutput);
                }
                String audioPath = ffmpegProcessor.transcodeToAAC(project.getId(), project.getUrl());
                createTranscript(audioPath, project.getId());
                projectRepository.updateStatus(project.getId(), Status.SUCCESS);
            } catch (Exception e) {
                projectRepository.updateStatus(project.getId(), Status.FAIL);
                throw new RuntimeException(e);
            }
        });
        return response.getId();
    }

    private void createTranscript(String audioPath, String id) throws IOException {
        log.info("[{}] Start creating transcript...", id);
        Transcript transcript = assemblyAIUtil.transcribe(new File(audioPath));
        assemblyAIUtil.writeOrganizedTranscriptData(id, transcript);
        try (FileWriter writer = new FileWriter("upload/" + id + "/text.txt")) {
            writer.write(transcript.getText().orElseGet(String::new));
        }
        log.info("[{}] Created transcript successfully!", id);
    }

    @Override
    public List<Project> listByUserId(String userId) {
        return projectRepository.findAll().stream().filter(project ->
                project.getAuthorId().equalsIgnoreCase(userId)
        ).toList();
    }

    @Override
    public List<Project> listByRoomId(String roomId) {
        return projectRepository.listByRoomId(roomId);
    }

    @Override
    public Project getProjectById(String id) {
        return projectRepository.getProjectById(id);
    }

    public void deleteById(String id) {
        try {
            FileUtils.deleteDirectory(new File("upload" + "/" + id));
        } catch (Exception ignore) {
        }
        projectRepository.deleteById(id);
    }

    public Project getById(String id) {
        return projectRepository.findAll().stream().filter(project ->
                project.getId().equalsIgnoreCase(id)
        ).findFirst().orElse(null);
    }

    @Override
    public void updateName(String id, String name) {
        projectRepository.updateName(id, name);
    }

    @PreDestroy
    public void destroy() {
        executor.shutdownNow();
    }
}
