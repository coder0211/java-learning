package com.app.cliptext.controllers;

import com.app.cliptext.entities.Room;
import com.app.cliptext.services.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    private final RoomService roomService;

    @PostMapping("/")
    public ResponseEntity<String> save(@RequestBody Room room) {
        room = roomService.save(room);
        return ResponseEntity.ok(room.getId());
    }

    @GetMapping("/owner/{id}")
    public ResponseEntity<List<Room>> listByOwner(@PathVariable(name="id") String id) {
        return ResponseEntity.ok(roomService.listByOwner(id));
    }

}
