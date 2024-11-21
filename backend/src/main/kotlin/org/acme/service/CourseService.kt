package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.exception.ServiceException
import org.acme.model.CourseEntity
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentDTO
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository

@ApplicationScoped
class CourseService(
    private val courseRepository: CourseRepository,
    private val studentRepository: StudentRepository,
) {
    fun findAllCourses(): List<CourseDTO> = courseRepository.listAll().map { course -> course.toCourseDTO() }

    fun findCourse(id: Long): CourseDTO {
        val course = courseRepository.findById(id) ?: throw ServiceException.CourseNotFoundException(id.toString())
        return course.toCourseDTO()
    }

    fun findCourses(
        page: Int,
        limit: Int,
        search: String?,
        sortField: String,
        sortOrder: String,
    ) = courseRepository.findCourses(page, limit, search.toString(), sortField, sortOrder)
        .map { course -> course.toCourseDTO() }

    fun countCourses(search: String) = courseRepository.count(search)

    @Transactional
    fun createCourse(name: String): CourseDTO {
        courseRepository.findByName(name)?.let {
            throw ServiceException.DuplicateCourseException(name)
        }
        val createdCourse = CourseEntity(name)
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
            if (it.id != id) throw ServiceException.DuplicateCourseException(name)
        }
        course.name = name
        courseRepository.persist(course)

        return course.toCourseDTO()
    }

    @Transactional
    fun deleteCourses(courseIDs: List<Long>): Boolean {
        if (courseIDs.isNotEmpty()) {
            val courses = courseRepository.findByIds(courseIDs)
            val fetchedCourseIds = courses.map { it.id }
            val missingCourses = courseIDs - fetchedCourseIds.toSet()
            if (missingCourses.isNotEmpty()) throw ServiceException.StudentNotFoundException(missingCourses.toString())
            courseRepository.deleteByIds(courseIDs)
            return true
        }
        return false
    }

    @Transactional
    fun assignStudents(
        id: Long,
        students: List<Long>,
    ): List<StudentDTO> {
        val course =
            courseRepository.findById(id)
                ?: throw ServiceException.CourseNotFoundException(id.toString())

        val fetchedStudents = studentRepository.findByIds(students)
        val fetchedStudentIds = fetchedStudents.map { it.id }
        val missingStudentsList = students - fetchedStudentIds.toSet()
        if (missingStudentsList.isNotEmpty()) throw ServiceException.StudentNotFoundException(missingStudentsList.toString())
        course.students.forEach { student ->
            if (!students.contains(student.id)) {
                student.courses.remove(course)
            }
        }
        course.students.clear()
        course.students.addAll(fetchedStudents)
        fetchedStudents.forEach { student ->
            if (!student.courses.contains(course)) {
                student.courses.add(course)
            }
        }
        return course.students.map { StudentDTO(it.id, it.firstName, it.lastName, it.email, emptyList()) }
    }
}
