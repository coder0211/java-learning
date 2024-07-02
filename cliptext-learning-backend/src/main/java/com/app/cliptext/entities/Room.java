package com.app.cliptext.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "Room")
@Getter
@Setter
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long genId;
    @Column(unique = true, name = "`id`")
    private String id;
    @Column(name = "`name`")
    private String name;
    private Long createdAt;
    private String owner;
    private Boolean isDefault;
}
