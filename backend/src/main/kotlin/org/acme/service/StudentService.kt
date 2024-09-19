package org.acme.service

import io.vertx.core.impl.ConcurrentHashSet
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.Student
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository

@ApplicationScoped
class StudentService(
    val studentRepository: StudentRepository,
    val courseRepository: CourseRepository
) {

    fun findAllStudents() = studentRepository.listAll()

    fun findStudent(id: Long) = studentRepository.findById(id)

    @Transactional
    fun createStudent(student: Student) {
        studentRepository.persist(student)
    }

    @Transactional
    fun updateStudent(updatedStudent: Student)
    = studentRepository.update("firstName = ?1, lastName = ?2, email = ?3 where id = ?4",
        updatedStudent.firstName, updatedStudent.lastName, updatedStudent.email, updatedStudent.id)

    @Transactional
    fun deleteStudents(studentIDs: List<Long>) {


        if (studentIDs.isNotEmpty()) {
            studentRepository.deleteByIds(studentIDs)
        }
    }

    @Transactional
    fun assignCourses(id: Long, addedCourses: List<Long>) {
        val student = studentRepository.findById(id) ?: throw Exception("Student not found")

        val fetchedAddedCourses = courseRepository.findByIds(addedCourses)
        val coursesToAdd = fetchedAddedCourses.filter { it !in student.courses }
        student.courses.addAll(coursesToAdd)

        studentRepository.persist(student)
    }


}