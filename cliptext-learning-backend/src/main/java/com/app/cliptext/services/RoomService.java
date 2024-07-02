package com.app.cliptext.services;

import com.app.cliptext.entities.Room;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoomService {
    Room save(Room room);
    Room update(Room room);
    List<Room> listByOwner(String id);
    void delete(String id);
}
