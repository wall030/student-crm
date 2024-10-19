package org.acme.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentDTO

@Entity
@Table(name = "student")
class StudentEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    var id: Long = 0L,
    @Column(name = "firstname")
    var firstName: String = "",
    @Column(name = "lastname")
    var lastName: String = "",
    @Column(name = "email", unique = true)
    var email: String = "",
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_course",
        joinColumns = [JoinColumn(name = "student_id")],
        inverseJoinColumns = [JoinColumn(name = "course_id")],
    )
    @JsonIgnoreProperties("students")
    var courses: MutableList<CourseEntity> = mutableListOf(),
) : PanacheEntityBase() {
    constructor(firstName: String, lastName: String, email: String) : this() {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
    }

    fun toStudentDTO(): StudentDTO {
        val coursesDTOs =
            this.courses.map { course ->
                CourseDTO(course.id, course.name, emptyList())
            }
        return StudentDTO(this.id, this.firstName, this.lastName, this.email, coursesDTOs)
    }
}
