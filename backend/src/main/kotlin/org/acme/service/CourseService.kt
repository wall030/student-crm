package org.acme.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.Student
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateCourseDTO
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
/*
    @Transactional
    fun assignStudents(
        id: Long,
        addedStudents: List<Long>,
    ): List<StudentDTO> {
        val course = courseRepository.findById(id) ?: throw Exception("Course not found")

        val fetchedAddedStudents = studentRepository.findByIds(addedStudents)

        // Initialize a list to hold unique students to add to the course
        val studentsToAdd = mutableListOf<Student>()

        // Iterate over fetched students and check if they are already in the course
        for (student in fetchedAddedStudents) {
            if (student !in course.students) {
                studentsToAdd.add(student)  // Add only if not already present
                if (course !in student.courses) {
                    student.courses.add(course)  // Add course to student only if necessary
                }
            }
        }

        // Add unique students to the course's student list
        course.students.addAll(studentsToAdd)

        // Persist the course (the changes to students will be automatically persisted)
        courseRepository.persist(course)

        // Optionally flush to ensure changes are written to the database
        courseRepository.flush()
        var studentDTOs = mutableListOf<StudentDTO>()
        course.students.forEach { studentDTOs.add(StudentDTO(it.id, it.firstName, it.lastName, it.email)) }
        return studentDTOs
    }

 */
}
