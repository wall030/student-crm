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
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

@QuarkusTest
class CourseServiceTest {
    @InjectMock
    private lateinit var courseRepository: CourseRepository

    @Inject
    private lateinit var courseService: CourseService

    @Test
    fun `should list all courses`() {
        val courses =
            mutableListOf<Course>(
                Course(1L, "Piloting 101"),
                Course(2L, "Lightsaber Combat"),
            )
        val coursesDtoList = courses.map { course -> course.toCourseDTO() }

        every { courseRepository.listAll() } returns courses
        val result = courseService.findAllCourses()

        expectThat(result).isEqualTo(coursesDtoList)
    }

    @Test
    fun `find course by id`() {
        val course = Course(1L, "Piloting 101")

        every { courseRepository.findById(course.id) } returns course
        val result = courseService.findCourse(course.id)

        expectThat(result).isEqualTo(course.toCourseDTO())
    }

    @Test
    @Transactional
    fun `create Course`() {
        val courseDTO = CreateCourseDTO("Tactical Warfare")

        every { courseRepository.findByName(courseDTO.name) } returns null
        every { courseRepository.persist(Course(0L, courseDTO.name)) } returns Unit
        val result = courseService.createCourse(courseDTO.name)

        expectThat(result.name).isEqualTo(courseDTO.name)
    }

    @Test
    @Transactional
    fun `should update course attributes`() {
        val course = Course(1L, "Starship Engineering")
        val courseDTO = course.toCourseDTO()

        every { courseRepository.findById(courseDTO.id) } returns course
        every { courseRepository.findByName(courseDTO.name) } returns course
        every { courseRepository.persist(course) } returns Unit

        val result = courseService.updateCourse(courseDTO.id, courseDTO.name)

        expectThat(result).isEqualTo(courseDTO)
    }

    @Test
    @Transactional
    fun `should delete a list of courses`() {
        val courseIDs = listOf(1L, 2L)
        val courses = listOf(
            Course(1L, "Starship Engineering"),
            Course(2L, "Piloting 101")
        )

        every { courseRepository.findByIds(courseIDs) } returns courses
        every { courseRepository.deleteByIds(courseIDs) } returns 2
        courseService.deleteCourses(courseIDs)

        verify { courseRepository.deleteByIds(courseIDs) }
    }
}
