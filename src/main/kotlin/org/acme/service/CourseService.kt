package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.Student
import org.acme.repository.CourseRepository

@ApplicationScoped
class CourseService(
    val courseRepository: CourseRepository
) {

    fun getAllCourses() = courseRepository.listAll()

    fun findCourse(course: Course) = courseRepository.findById(course.id)

    @Transactional
    fun createCourse(course: Course) {
        courseRepository.persist(course)
    }

    @Transactional
    fun updateCourse(updatedCourse: Course)
            = courseRepository.update("name = ?1 where id = ?2",
        updatedCourse.name, updatedCourse.id)

    @Transactional
    fun deleteCourses(courses: List<Course>) {
        val ids = courses.mapNotNull { it.id }

        if (ids.isNotEmpty()) {
            courseRepository.deleteByIds(ids)
        }
    }

}