package org.acme.model.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

// Used for request updating and response

data class CourseDTO(
    @field:NotBlank(message = "ID is required")
    val id: Long,
    @field:NotBlank(message = "Name is required")
    @field:Size(min = 1, max = 35, message = "Max 35 characters for name")
    val name: String,
    @JsonIgnoreProperties("courses")
    val students: List<StudentDTO>? = emptyList(),
)
