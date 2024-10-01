package org.acme.model.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.acme.model.Student

data class CreateStudentDTO(
    @field:NotBlank(message = "First name is required")
    @field:Size(min = 1, max = 20, message = "Max 20 characters for first name")
    val firstName: String,
    @field:NotBlank(message = "Last name is required")
    @field:Size(min = 1, max = 20, message = "Max 20 characters for last name")
    val lastName: String,
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Invalid email format")
    val email: String,
) {
    fun toStudentEntity(): Student {
        var student =
            Student(
                0L,
                this.firstName,
                this.lastName,
                this.email,
            )
        return student
    }
}
