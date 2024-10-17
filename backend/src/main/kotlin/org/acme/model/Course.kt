package org.acme.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.quarkus.hibernate.orm.panache.PanacheEntityBase
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentDTO

@Entity
@Table(name = "course")
data class Course(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0L,
    var name: String = "",
    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("courses")
    var students: MutableList<Student> = mutableListOf(),
) : PanacheEntityBase() {
    constructor(name: String) : this() {
        this.name = name
    }

    fun toCourseDTO(): CourseDTO {
        val studentDTOs =
            this.students.map { student ->
                StudentDTO(student.id, student.firstName, student.lastName, student.email)
            }
        return CourseDTO(this.id, this.name, studentDTOs)
    }
}
