package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentDTO
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository

@ApplicationScoped
class CourseService(
    val courseRepository: CourseRepository,
    val studentRepository: StudentRepository,
) {
    fun getAllCourses() = courseRepository.listAll()

    fun findCourse(id: Long) = courseRepository.findById(id)

    @Transactional
    fun createCourse(courseDTO: Course): Course {
        val createdCourse = Course(0, courseDTO.name)
        courseRepository.persist(createdCourse)
        return createdCourse
    }

    @Transactional
    fun updateCourse(updatedCourse: Course): CourseDTO {
        courseRepository.update(
            "name = ?1 where id = ?2",
            updatedCourse.name,
            updatedCourse.id,
        )
        return CourseDTO(updatedCourse.id, updatedCourse.name)
    }

    @Transactional
    fun deleteCourses(courses: List<Course>) {
        val ids = courses.mapNotNull { it.id }

        if (ids.isNotEmpty()) {
            courseRepository.deleteByIds(ids)
        }
    }

    @Transactional
    fun assignStudents(
        id: Long,
        addedStudents: List<Long>,
    ): List<StudentDTO> {
        val course = courseRepository.findById(id) ?: throw Exception("Course not found")

        val fetchedAddedStudents = studentRepository.findByIds(addedStudents)
        val studentsToAdd = fetchedAddedStudents.filter { it !in course.students }
        course.students.addAll(studentsToAdd)

        courseRepository.persist(course)
        courseRepository.flush()
        var studentDTOs = mutableListOf<StudentDTO>()
        course.students.forEach { studentDTOs.add(StudentDTO(it.id, it.firstName, it.lastName, it.email)) }
        return studentDTOs
    }
}
