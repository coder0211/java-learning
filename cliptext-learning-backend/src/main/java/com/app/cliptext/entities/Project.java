package com.app.cliptext.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "Project")
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long genId;

    @Column(unique = true, name = "`id`")
    private String id;
    @Column(name = "`name`")
    private String name;
    @Column(name = "`url`")
    private String url;
    private Long createdAt;
    private String authorId;
    private String authorName;
    @Column(name = "`kind`")
    @Enumerated(EnumType.STRING)
    private Kind kind;
    @Column(name = "`uploadType`")
    @Enumerated(EnumType.STRING)
    private UploadType uploadType;
    @Column(name = "`status`")
    @Enumerated(EnumType.STRING)
    private Status status;
    private Double duration;
    private String thumbnail;
    private String roomId;

    public Project() {

    }
}
