package com.app.cliptext.processor;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.List;

public class CommandProcessor {

    public void execute(String id, List<String> command) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        try (BufferedReader processOutputReader = new BufferedReader(new InputStreamReader(process.getInputStream(), Charset.defaultCharset()))) {
            String line;
            while ((line = processOutputReader.readLine()) != null) {
                System.out.printf("[%s][%s]: %s\n", id, new Date(System.currentTimeMillis()), line);
            }
            process.waitFor();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

}
