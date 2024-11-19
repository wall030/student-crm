package org.acme.service

import io.mockk.every
import io.mockk.verify
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.acme.model.CourseEntity
import org.acme.model.StudentEntity
import org.acme.model.dto.CourseCreateUpdateDTO
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentCreateUpdateDTO
import org.acme.model.dto.StudentDTO
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isTrue

@QuarkusTest
class CourseServiceTest {
    @InjectMock
    private lateinit var courseRepository: CourseRepository

    @InjectMock
    private lateinit var studentRepository: StudentRepository

    @Inject
    private lateinit var courseService: CourseService

    private val student1 = StudentEntity(1L, "Luke", "Skywalker", "luke@jedi.com")
    private val student2 = StudentEntity(2L, "Han", "Solo", "solo@smuggler.com")
    private val studentsList = listOf(student1, student2)
    private val studentIDs = listOf(student1.id, student2.id)

    private val course1 = CourseEntity(1L, "Piloting 101")
    private val course2 = CourseEntity(2L, "Lightsaber Combat")
    private val coursesList = listOf(course1, course2)
    private val courseIDs = listOf<Long>(course1.id, course2.id)

    @Test
    fun `should list all courses`() {
        every { courseRepository.listAll() } returns coursesList
        val result = courseService.findAllCourses()
        expectThat(result).isEqualTo(coursesList.map { course -> course.toCourseDTO() })
    }

    @Test
    fun `find course by id`() {
        every { courseRepository.findById(any()) } returns course1
        val result = courseService.findCourse(course1.id)
        expectThat(result).isEqualTo(course1.toCourseDTO())
    }

    @Test
    @Transactional
    fun `create Course`() {
        val courseDTO = course1.toCourseDTO()
        every { courseRepository.findByName(any()) } returns null
        every { courseRepository.persist(any<CourseEntity>()) } returns Unit
        val result = courseService.createCourse(courseDTO.name)
        expectThat(result.name).isEqualTo(courseDTO.name)
    }

    @Test
    @Transactional
    fun `should update course attributes`() {
        val courseDTO = course1.toCourseDTO()
        every { courseRepository.findById(any()) } returns course1
        every { courseRepository.findByName(any()) } returns course1
        every { courseRepository.persist(course1) } returns Unit
        val result = courseService.updateCourse(courseDTO.id, courseDTO.name)
        expectThat(result).isEqualTo(courseDTO)
    }

    @Test
    @Transactional
    fun `should delete a list of courses`() {
        every { courseRepository.findByIds(courseIDs) } returns coursesList
        every { courseRepository.deleteByIds(courseIDs) } returns courseIDs.size.toLong()
        val result = courseService.deleteCourses(courseIDs)
        expectThat(result).isTrue()

    }

    @Test
    @Transactional
    fun `should assign a list of students to a course`() {
        every { studentRepository.findByIds(any()) } returns studentsList
        every { courseRepository.findById(any()) } returns course1
        every { courseRepository.persist(any<CourseEntity>()) } returns Unit
        val result = courseService.assignStudents(course1.id, studentIDs)
        expectThat(result).isEqualTo(
            listOf(
                StudentDTO(student1.id, student1.firstName, student1.lastName, student1.email),
                StudentDTO(student2.id, student2.firstName, student2.lastName, student2.email)
            )
        )
    }
}
