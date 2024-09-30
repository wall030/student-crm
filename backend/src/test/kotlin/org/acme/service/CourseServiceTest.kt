package org.acme.service

import io.mockk.every
import io.mockk.verify
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateCourseDTO
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

@QuarkusTest
class CourseServiceTest {
    @InjectMock
    private lateinit var studentRepository: StudentRepository

    @InjectMock
    private lateinit var courseRepository: CourseRepository

    @Inject
    private lateinit var courseService: CourseService

    @Test
    fun `should list all courses`() {
        val courses =
            mutableListOf<Course>(
                Course(1L, "Pilotin 101"),
                Course(2L, "Lightsaber Combat"),
            )

        every { courseRepository.listAll() } returns courses
        val result = courseService.findAllCourses()
        expectThat(result).isEqualTo(courses)
    }

    @Test
    fun `find course by id`() {
        val course = Course(1L, "Piloting 101")

        every { courseRepository.findById(course.id) } returns course
        val result = courseService.findCourse(course.id)
        expectThat(result).isEqualTo(course)
    }

    @Test
    @Transactional
    fun `create Course`() {
        val courseDTO = CreateCourseDTO("Tactical Warfare")

        every {
            courseRepository.persist(Course(0L, courseDTO.name))
        } returns Unit
        val result = courseService.createCourse(courseDTO)

        expectThat(result.name).isEqualTo(courseDTO.name)
    }

    @Test
    @Transactional
    fun `should update course attributes`() {
        val updatedCourse = CourseDTO(1L, "Starship Engineering")

        every {
            courseRepository.update(
                "name = ?1 where id = ?2",
                updatedCourse.name,
                updatedCourse.id,
            )
        } returns 1
        val result = courseService.updateCourse(updatedCourse)
        expectThat(result).isEqualTo(updatedCourse)
    }

    @Test
    @Transactional
    fun `should delete a list of courses`() {
        val courseIDs = listOf(1L, 2L)

        every { courseRepository.deleteByIds(courseIDs) } returns 2
        courseService.deleteCourses(courseIDs)
        verify(exactly = 1) { courseRepository.deleteByIds(courseIDs) }
    }
/*
    @Test
    @Transactional
    fun `should assign a list of students to a course`() {
        val studentIDs = listOf<Long>(1L, 2L)
        val courseID = 1L
        val updatedCourse = Course(courseID, "Starship Engineering")
        val student1 = Student(0L, "Luke", "Skywalker", "luke@jedi.com")
        val student2 = Student(0L, "Leia", "Organa", "leia@rebel.com")

        every { studentRepository.findByIds(studentIDs) } returns listOf(student1, student2)
        every { courseRepository.findById(courseID) } returns updatedCourse
        every { courseRepository.persist(updatedCourse) } returns Unit
        every { courseRepository.flush() } returns Unit

        val result = courseService.assignStudents(courseID, studentIDs)

        expectThat(result).isEqualTo(
            listOf(
                StudentDTO(student1.id, student1.firstName, student1.lastName, student1.email),
                StudentDTO(student2.id, student2.firstName, student2.lastName, student2.email),
            ),
        )
        verify { courseRepository.persist(updatedCourse) }
    }

 */
}
