package com.app.cliptext.repository;

import com.app.cliptext.entities.Project;
import com.app.cliptext.entities.Status;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Project p where p.id = ?1")
    void deleteById(String id);

    @Transactional
    @Modifying
    @Query("UPDATE Project p SET p.name = ?2 WHERE p.id = ?1")
    void updateName(String id, String name);

    @Transactional
    @Modifying
    @Query("UPDATE Project p SET p.status = ?2 WHERE p.id = ?1")
    void updateStatus(String id, Status status);

    @Transactional
    @Modifying
    @Query("UPDATE Project p SET p.thumbnail = ?2 WHERE p.id = ?1")
    void updateThumbnail(String id, String thumbnail);

    @Query("SELECT p from Project p where p.roomId = ?1")
    List<Project> listByRoomId(String id);

    @Query("SELECT p from Project p where p.id = ?1")
    Project getProjectById(String id);
}
