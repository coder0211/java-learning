package com.app.cliptext.services;


import com.app.cliptext.entities.Room;
import com.app.cliptext.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public Room save(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public Room update(Room room) {
        return null;
    }

    @Override
    public List<Room> listByOwner(String id) {
        return roomRepository.listByOwner(id);
    }

    @Override
    public void delete(String id) {

    }
}
