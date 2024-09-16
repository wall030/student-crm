package org.acme.model

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany
import java.util.UUID


@Entity
class Course(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val uuid: Long? = null,

    var name: String,

    //@ManyToMany(fetch = FetchType.LAZY)
    //var students: List<Student>
)