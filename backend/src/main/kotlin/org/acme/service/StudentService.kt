package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Student
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentDTO
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository
import kotlin.collections.map

@ApplicationScoped
class StudentService(
    private val studentRepository: StudentRepository,
    private val courseRepository: CourseRepository,
) {
    fun findAllStudents() = studentRepository.listAll().map { student -> student.toStudentDTO() }

    fun findStudents(
        page: Int,
        limit: Int,
        search: String?,
    ) = studentRepository.findStudents(page, limit, search.toString())
        .map { student -> student.toStudentDTO() }

    fun findStudent(id: Long) = studentRepository.findById(id).toStudentDTO()

    @Transactional
    fun createStudent(
        firstName: String,
        lastName: String,
        email: String,
    ): StudentDTO {
        studentRepository.findByEmail(email)?.let {
            throw Exception("Student with email $email already exists")
        }
        val createdStudent = Student(firstName, lastName, email)
        studentRepository.persist(createdStudent)
        return createdStudent.toStudentDTO()
    }

    @Transactional
    fun updateStudent(
        id: Long,
        firstName: String,
        lastName: String,
        email: String,
    ): StudentDTO {
        studentRepository.update(
            "firstName = ?1, lastName = ?2, email = ?3 where id = ?4",
            firstName,
            lastName,
            email,
            id,
        )
        return StudentDTO(id, firstName, lastName, email)
    }

    @Transactional
    fun deleteStudents(studentIDs: List<Long>) {
        if (studentIDs.isNotEmpty()) {
            studentRepository.deleteByIds(studentIDs)
        }
    }

    @Transactional
    fun assignCourses(
        id: Long,
        addedCourses: List<Long>,
    ): List<CourseDTO> {
        val student = studentRepository.findById(id) ?: throw Exception("Student not found")

        val fetchedAddedCourses = courseRepository.findByIds(addedCourses)
        val coursesToAdd = fetchedAddedCourses.filter { it !in student.courses }
        student.courses.addAll(coursesToAdd)

        studentRepository.persist(student)
        var courseDTOs = mutableListOf<CourseDTO>()
        student.courses.forEach { courseDTOs.add(CourseDTO(it.id, it.name)) }
        return courseDTOs
    }

    @Transactional
    fun removeCourses(
        id: Long,
        addedCourses: List<Long>,
    ): List<CourseDTO> {
        val student = studentRepository.findById(id) ?: throw Exception("Student not found")

        val fetchedCoursesToRemove = courseRepository.findByIds(addedCourses)
        val coursesToRemove = fetchedCoursesToRemove.filter { it in student.courses }
        student.courses.removeAll(coursesToRemove)

        studentRepository.persist(student)
        var courseDTOs = mutableListOf<CourseDTO>()
        student.courses.forEach { courseDTOs.add(CourseDTO(it.id, it.name)) }
        return courseDTOs
    }
}
