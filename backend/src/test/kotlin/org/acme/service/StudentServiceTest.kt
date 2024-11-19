package org.acme.service

import io.mockk.every
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.acme.model.CourseEntity
import org.acme.model.StudentEntity
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isTrue

@QuarkusTest
class StudentServiceTest {
    @InjectMock
    private lateinit var studentRepository: StudentRepository

    @InjectMock
    private lateinit var courseRepository: CourseRepository

    @Inject
    private lateinit var studentService: StudentService

    private val student1 = StudentEntity(1L, "Luke", "Skywalker", "luke@jedi.com")
    private val student2 = StudentEntity(2L, "Han", "Solo", "solo@smuggler.com")
    private val studentsList = listOf(student1, student2)
    private val studentIDs = listOf(student1.id, student2.id)

    private val course1 = CourseEntity(1L, "Piloting 101")
    private val course2 = CourseEntity(2L, "Lightsaber Combat")
    private val coursesList = listOf(course1, course2)
    private val courseIDs = listOf<Long>(course1.id, course2.id)

    @Test
    fun `should list all students`() {
        every { studentRepository.listAll() } returns studentsList
        val result = studentService.findAllStudents()
        expectThat(result).isEqualTo(studentsList.map { student -> student.toStudentDTO() })
    }

    @Test
    fun `find student by id`() {
        every { studentRepository.findById(any()) } returns student1
        val result = studentService.findStudent(student1.id)
        expectThat(result).isEqualTo(student1.toStudentDTO())
    }

    @Test
    @Transactional
    fun `create Student`() {
        val studentDTO = student1.toStudentDTO()
        every { studentRepository.persist(any<StudentEntity>()) } returns Unit
        every { studentRepository.findByEmail(any()) } returns null
        val result = studentService.createStudent(studentDTO.firstName, studentDTO.lastName, studentDTO.email)
        expectThat(result)
            .and {
                get { firstName }.isEqualTo(studentDTO.firstName)
            }
            .and {
                get { lastName }.isEqualTo(studentDTO.lastName)
            }
            .and {
                get { email }.isEqualTo(studentDTO.email)
            }
    }

    @Test
    @Transactional
    fun `should update student attributes`() {
        val studentDTO = student1.toStudentDTO()
        every { studentRepository.findById(any()) } returns student1
        every { studentRepository.findByEmail(any()) } returns student1
        every { studentRepository.persist(any<StudentEntity>()) } returns Unit
        val result =
            studentService.updateStudent(
                studentDTO.id,
                studentDTO.firstName,
                studentDTO.lastName,
                studentDTO.email,
            )
        expectThat(result).isEqualTo(studentDTO)
    }

    @Test
    @Transactional
    fun `should delete a list of students`() {
        every { studentRepository.findByIds(any()) } returns studentsList
        every { studentRepository.deleteByIds(any()) } returns studentIDs.size.toLong()
        val result = studentService.deleteStudents(studentIDs)
        expectThat(result).isTrue()
    }

    @Test
    @Transactional
    fun `should assign a list of courses to a student`() {
        every { courseRepository.findByIds(any()) } returns coursesList
        every { studentRepository.findById(any()) } returns student1
        every { studentRepository.persist(any<StudentEntity>()) } returns Unit
        val result = studentService.assignCourses(student1.id, courseIDs)
        expectThat(result).isEqualTo(listOf(course1.toCourseDTO(), course2.toCourseDTO()))
        System.out.println(listOf(course1.toCourseDTO(), course2.toCourseDTO()))
    }
}
