package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Student
import org.acme.repository.StudentRepository

@ApplicationScoped
class StudentService(
    val studentRepository: StudentRepository
) {

    fun findAllStudents() = studentRepository.listAll()

    @Transactional
    fun createStudent(student: Student) {
        studentRepository.persist(student)
    }

    @Transactional
    fun updateStudent(updatedStudent: Student)
    = studentRepository.update("firstName = ?1, lastName = ?2, email = ?3 where id = ?4",
        updatedStudent.firstName, updatedStudent.lastName, updatedStudent.email, updatedStudent.id)

    @Transactional
    fun deleteStudents(students: List<Student>) {
        val ids = students.mapNotNull { it.id }

        if (ids.isNotEmpty()) {
            studentRepository.deleteByIds(ids)
        }
    }


}