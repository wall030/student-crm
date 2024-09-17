package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import org.acme.repository.CourseRepository

@ApplicationScoped
class CourseService(
    val courseRepository: CourseRepository
) {

    fun getAllCourses() = courseRepository.listAll()


}