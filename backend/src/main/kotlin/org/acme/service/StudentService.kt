package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.exception.ServiceException
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
    fun deleteStudents(studentIDs: List<Long>) {
        if (studentIDs.isNotEmpty()) {
            val students = studentRepository.findByIds(studentIDs)
            val missingStudents = studentIDs.filter { id -> students.none { it.id == id } }

            if (missingStudents.isNotEmpty()) throw ServiceException.StudentNotFoundException(missingStudents.toString())

            studentRepository.deleteByIds(studentIDs)
        }
    }


    @Transactional
    fun assignCourses(
        id: Long,
        addedCourses: List<Long>,
    ): List<CourseDTO> {
        val student = studentRepository.findById(id)
            ?: throw ServiceException.StudentNotFoundException(id.toString())

        val fetchedAddedCourses = courseRepository.findByIds(addedCourses)
        val missingCourses = addedCourses.filter { courseId ->
            fetchedAddedCourses.none { it.id == courseId }
        }
        if (missingCourses.isNotEmpty()) {
            throw ServiceException.CourseNotFoundException(missingCourses.toString())
        }

        val coursesToAdd = fetchedAddedCourses.filter { it !in student.courses }
        student.courses.addAll(coursesToAdd)
        studentRepository.persist(student)

        return student.courses.map { CourseDTO(it.id, it.name) }
    }

    @Transactional
    fun removeCourses(
        id: Long,
        addedCourses: List<Long>,
    ): List<CourseDTO> {
        val student = studentRepository.findById(id)
            ?: throw ServiceException.StudentNotFoundException(id.toString())

        val fetchedCoursesToRemove = courseRepository.findByIds(addedCourses)
        val missingCourses = addedCourses.filter { courseId ->
            fetchedCoursesToRemove.none { it.id == courseId }
        }
        if (missingCourses.isNotEmpty()) {
            throw ServiceException.CourseNotFoundException(missingCourses.toString())
        }

        val coursesToRemove = fetchedCoursesToRemove.filter { it in student.courses }
        student.courses.removeAll(coursesToRemove)
        studentRepository.persist(student)

        return student.courses.map { CourseDTO(it.id, it.name) }
    }
}
