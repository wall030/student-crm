package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.exception.ServiceException
import org.acme.model.Course
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentDTO
import org.acme.repository.CourseRepository

@ApplicationScoped
class CourseService(
    private val courseRepository: CourseRepository,
) {
    fun findAllCourses(): List<CourseDTO> = courseRepository.listAll().map { course -> course.toCourseDTO() }

    fun findCourse(id: Long): CourseDTO? = courseRepository.findById(id).toCourseDTO()

    fun findCourses(
        page: Int,
        limit: Int,
        search: String?,
    ) = courseRepository.findCourses(page, limit, search.toString())
        .map { course -> course.toCourseDTO() }

    @Transactional
    fun createCourse(name: String): CourseDTO {
        courseRepository.findByName(name)?.let {
            throw ServiceException.DuplicateCourseException(name)
        }
        val createdCourse = Course(name)
        courseRepository.persist(createdCourse)
        return createdCourse.toCourseDTO()
    }

    @Transactional
    fun updateCourse(
        id: Long,
        name: String,
    ): CourseDTO {
        val course = courseRepository.findById(id) ?: throw ServiceException.CourseNotFoundException(id.toString())

        courseRepository.findByName(name)?.let {
            if (it.name != name) throw ServiceException.DuplicateCourseException(name)
        }
        course.name = name
        courseRepository.persist(course)

        return course.toCourseDTO()
    }

    @Transactional
    fun deleteCourses(courseIDs: List<Long>) {
        if (courseIDs.isNotEmpty()) {
            val courses = courseRepository.findByIds(courseIDs)
            val missingCourses = courseIDs.filter { id -> courses.none { it.id == id } }

            if (missingCourses.isNotEmpty()) throw ServiceException.StudentNotFoundException(missingCourses.toString())

            courseRepository.deleteByIds(courseIDs)
        }
    }
}
