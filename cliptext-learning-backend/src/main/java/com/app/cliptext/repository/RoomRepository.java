package com.app.cliptext.repository;

import com.app.cliptext.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT r from Room r where r.owner = ?1")
    List<Room> listByOwner(String id);

}
