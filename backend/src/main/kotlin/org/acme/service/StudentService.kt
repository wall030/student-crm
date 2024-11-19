package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.exception.ServiceException
import org.acme.model.StudentEntity
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
        sortField: String,
        sortOrder: String,
    ) = studentRepository.findStudents(page, limit, search.toString(), sortField, sortOrder)
        .map { student -> student.toStudentDTO() }

    fun countStudents(search: String) = studentRepository.count(search)

    fun findStudent(id: Long): StudentDTO {
        val student = studentRepository.findById(id) ?: throw ServiceException.StudentNotFoundException(id.toString())
        return student.toStudentDTO()
    }

    @Transactional
    fun createStudent(
        firstName: String,
        lastName: String,
        email: String,
    ): StudentDTO {
        studentRepository.findByEmail(email)?.let {
            throw ServiceException.DuplicateStudentException(email)
        }
        val createdStudent = StudentEntity(firstName, lastName, email)
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
        val student = studentRepository.findById(id) ?: throw ServiceException.StudentNotFoundException(id.toString())

        studentRepository.findByEmail(email)?.let {
            if (it.id != id) throw ServiceException.DuplicateStudentException(email)
        }
        student.firstName = firstName
        student.lastName = lastName
        student.email = email
        studentRepository.persist(student)

        return student.toStudentDTO()
    }

    @Transactional
    fun deleteStudents(studentIDs: List<Long>): Boolean {
        if (studentIDs.isNotEmpty()) {
            val students = studentRepository.findByIds(studentIDs)
            val missingStudents = studentIDs.filter { id -> students.none { it.id == id } }

            if (missingStudents.isNotEmpty()) throw ServiceException.StudentNotFoundException(missingStudents.toString())

            studentRepository.deleteByIds(studentIDs)
            return true
        }
        return false
    }

    @Transactional
    fun assignCourses(
        id: Long,
        courses: List<Long>,
    ): List<CourseDTO> {
        val missingCoursesList = mutableListOf<Long>()
        val student =
            studentRepository.findById(id)
                ?: throw ServiceException.StudentNotFoundException(id.toString())

        val fetchedCourses = courseRepository.findByIds(courses)
        val fetchedCourseIds = fetchedCourses.map { it.id }

        courses.forEach { courseId ->
            if (!fetchedCourseIds.contains(courseId)) {
                missingCoursesList.add(courseId)
            }
        }
        if (missingCoursesList.isNotEmpty()) throw ServiceException.CourseNotFoundException(missingCoursesList.toString())
        student.courses = fetchedCourses.toMutableList()
        studentRepository.persist(student)

        return student.courses.map { CourseDTO(it.id, it.name, emptyList()) }
    }
}
