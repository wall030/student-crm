package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Student
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateStudentDTO
import org.acme.model.dto.StudentDTO
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository

@ApplicationScoped
class StudentService(
    private val studentRepository: StudentRepository,
    private val courseRepository: CourseRepository,
) {
    fun findAllStudents() = studentRepository.listAll()

    fun findStudent(id: Long) = studentRepository.findById(id)

    @Transactional
    fun createStudent(studentDTO: CreateStudentDTO): Student {
        val createdStudent = studentDTO.toStudentEntity()
        studentRepository.persist(createdStudent)
        return createdStudent   
    }

    @Transactional
    fun updateStudent(updatedStudent: StudentDTO): StudentDTO {
        studentRepository.update(
            "firstName = ?1, lastName = ?2, email = ?3 where id = ?4",
            updatedStudent.firstName,
            updatedStudent.lastName,
            updatedStudent.email,
            updatedStudent.id,
        )
        return StudentDTO(updatedStudent.id, updatedStudent.firstName, updatedStudent.lastName, updatedStudent.email)
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
}
