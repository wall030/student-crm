package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateCourseDTO
import org.acme.repository.CourseRepository

@ApplicationScoped
class CourseService(
    val courseRepository: CourseRepository,
) {
    fun findAllCourses() = courseRepository.listAll()

    fun findCourse(id: Long): Course? = courseRepository.findById(id)

    @Transactional
    fun createCourse(courseDTO: CreateCourseDTO): Course {
        val createdCourse = Course(0, courseDTO.name)
        courseRepository.persist(createdCourse)
        return createdCourse
    }

    @Transactional
    fun updateCourse(updatedCourse: CourseDTO): CourseDTO {
        courseRepository.update(
            "name = ?1 where id = ?2",
            updatedCourse.name,
            updatedCourse.id,
        )
        return CourseDTO(updatedCourse.id, updatedCourse.name)
    }

    @Transactional
    fun deleteCourses(courses: List<Long>) {
        if (courses.isNotEmpty()) {
            courseRepository.deleteByIds(courses)
        }
    }
}
