package com.app.cliptext.util;


import java.io.FileWriter;
import java.io.IOException;

public class FileHandlerUtil {

    public static String getUploadPath(String id, String filename) {
        return "upload/" + id + "/" + filename;
    }

    public static void writeJSON(String json, String filepath) {
        try (FileWriter writer = new FileWriter(filepath)) {
            writer.write(json);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
