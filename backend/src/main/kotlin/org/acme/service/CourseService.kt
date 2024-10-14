package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.dto.CourseDTO
import org.acme.repository.CourseRepository

@ApplicationScoped
class CourseService(
    private val courseRepository: CourseRepository,
) {
    fun findAllCourses(): List<CourseDTO> = courseRepository.listAll().map { course -> course.toCourseDTO() }

    fun findCourse(id: Long): CourseDTO? = courseRepository.findById(id).toCourseDTO()

    @Transactional
    fun createCourse(name: String): CourseDTO {
        val createdCourse = Course(name)
        courseRepository.persist(createdCourse)
        return createdCourse.toCourseDTO()
    }

    @Transactional
    fun updateCourse(
        id: Long,
        name: String,
    ): CourseDTO {
        courseRepository.update("name = ?1 where id = ?2", name, id)
        return CourseDTO(id, name)
    }

    @Transactional
    fun deleteCourses(courses: List<Long>) {
        if (courses.isNotEmpty()) {
            courseRepository.deleteByIds(courses)
        }
    }
}
