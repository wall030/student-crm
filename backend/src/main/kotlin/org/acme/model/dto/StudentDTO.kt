package org.acme.model.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

// Used for response

data class StudentDTO(
    @field:NotBlank(message = "ID is required")
    val id: Long,
    val firstName: String,
    val lastName: String,
    @field:Email(message = "Invalid email format")
    val email: String,
    @JsonIgnoreProperties("students")
    val courses: List<CourseDTO>,
)
