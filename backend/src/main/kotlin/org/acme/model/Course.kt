package org.acme.model

import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table


@Entity
data class Course(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    var name: String = "",

    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    var students: MutableSet<Student> = mutableSetOf()
): PanacheEntityBase()