package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import org.acme.repository.StudentRepository

@ApplicationScoped
class StudentService(
    val studentRepository: StudentRepository
) {

    fun getAllStudents() = studentRepository.listAll()


}