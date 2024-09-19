package org.acme.model.dto

import org.acme.model.Student

data class CreateStudentDTO (
    val firstName: String,
    val lastName: String,
    val email: String
){
    fun toStudentEntity() : Student{
        var student = Student(
            0,
            this.firstName,
            this.lastName,
            this.email
        )
        return student
    }
}

