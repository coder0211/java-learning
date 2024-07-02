package com.app.cliptext.services;

import com.app.cliptext.entities.Project;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProjectService {
    String save(Project project);

    List<Project> listByUserId(String userId);
    List<Project> listByRoomId(String roomId);

    Project getProjectById(String id);

    void deleteById(String id);

    void updateName(String id, String name);

    Project getById(String id);
}
