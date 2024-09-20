package org.acme.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table

@Entity
@Table(name = "student")
data class Student(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0L,
    var firstName: String = "",
    var lastName: String = "",
    var email: String = "",
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_course",
        joinColumns = [JoinColumn(name = "student_id")],
        inverseJoinColumns = [JoinColumn(name = "course_id")],
    )
    @JsonIgnoreProperties("students")
    var courses: MutableList<Course> = mutableListOf(),
) : PanacheEntityBase()
