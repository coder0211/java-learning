package com.app.cliptext;

import com.app.cliptext.assembly.ai.AssemblyAIUtil;
import com.app.cliptext.processor.FfmpegProcessor;
import com.assemblyai.api.resources.transcripts.types.Transcript;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileWriter;
import java.io.IOException;


public class Main {
    public static void main(String[] args) throws Exception {
//        AssemblyAIUtil assemblyAIUtil =  new AssemblyAIUtil();
//        Transcript transcript = assemblyAIUtil.getTranscript("1d7ffa61-1342-4c00-a40c-c11355b8b20a");
//        assemblyAIUtil.writeOrganizedTranscriptData("123", transcript);
        FfmpegProcessor ffmpegProcessor = new FfmpegProcessor();
        String output = ffmpegProcessor.exportToMP4("123", "upload/2a975447-e4cf-4ae5-b459-042070e37e38/Learn English With Barack Obama_1080p.mp4");
        System.out.println(output);
    }

    private static void writeJSON(Object object, String filename) {
        try (FileWriter writer = new FileWriter(filename)) {
            ObjectMapper objectMapper = new ObjectMapper();
            String data = objectMapper.writeValueAsString(object);
            System.out.println(data);
            writer.write(data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    static class Student {
        private String name;
        private String age;

        public Student(String name, String age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAge() {
            return age;
        }

        public void setAge(String age) {
            this.age = age;
        }
    }

}
