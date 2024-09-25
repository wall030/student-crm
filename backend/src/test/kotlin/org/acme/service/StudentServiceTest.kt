package org.acme.service

import io.mockk.every
import io.mockk.verify
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.Student
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateStudentDTO
import org.acme.model.dto.StudentDTO
import org.acme.repository.CourseRepository
import org.acme.repository.StudentRepository
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

@QuarkusTest
class StudentServiceTest {
    @InjectMock
    private lateinit var studentRepository: StudentRepository

    @InjectMock
    private lateinit var courseRepository: CourseRepository

    @Inject
    private lateinit var studentService: StudentService

    @Test
    fun `should list all students`() {
        val students =
            mutableListOf<Student>(
                Student(firstName = "Luke", lastName = "Skywalker", email = "luke@jedi.com"),
                Student(firstName = "Leia", lastName = "Organa", email = "leia@rebel.com"),
            )

        every { studentRepository.listAll() } returns students
        val result = studentService.findAllStudents()
        expectThat(result).isEqualTo(students)
    }

    @Test
    fun `find student by id`() {
        val student = Student(id = 1L, firstName = "Han", lastName = "Solo", email = "solo@smuggler.com")

        every { studentRepository.findById(student.id) } returns student
        val result = studentService.findStudent(student.id)
        expectThat(result).isEqualTo(student)
    }

    @Test
    @Transactional
    fun `create Student`() {
        val studentDTO = CreateStudentDTO("Darth", "Vader", "vader@sith.com")

        every {
            studentRepository.persist(Student(0L, studentDTO.firstName, studentDTO.lastName, studentDTO.email))
        } returns Unit
        val result = studentService.createStudent(studentDTO)

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
        val updatedStudent = StudentDTO(1L, "Darth", "Maul", "noleg@sith.com")

        every {
            studentRepository.update(
                "firstName = ?1, lastName = ?2, email = ?3 where id = ?4",
                updatedStudent.firstName,
                updatedStudent.lastName,
                updatedStudent.email,
                updatedStudent.id,
            )
        } returns 1
        val result = studentService.updateStudent(updatedStudent)
        expectThat(result).isEqualTo(updatedStudent)
    }

    @Test
    @Transactional
    fun `should delete a list of students`() {
        val studentIDs = listOf(1L, 2L)

        every { studentRepository.deleteByIds(studentIDs) } returns 2
        studentService.deleteStudents(studentIDs)
        verify(exactly = 1) { studentRepository.deleteByIds(studentIDs) }
    }

    @Test
    @Transactional
    fun `should assign a list of courses to a student`() {
        val courseIDs = listOf<Long>(1L, 2L)
        val studentID = 1L
        val updatedStudent = Student(studentID, "Rey", "Palpatine", "rey@scavenger.com")
        val course1 = Course(1L, "Piloting 101")
        val course2 = Course(2L, "Lightsaber Combat")

        every { courseRepository.findByIds(courseIDs) } returns listOf(course1, course2)
        every { studentRepository.findById(studentID) } returns updatedStudent
        every { studentRepository.persist(updatedStudent) } returns Unit

        val result = studentService.assignCourses(studentID, courseIDs)

        expectThat(result).isEqualTo(
            listOf(
                CourseDTO(course1.id, course1.name),
                CourseDTO(course2.id, course2.name),
            ),
        )
        verify { studentRepository.persist(updatedStudent) }
    }
}
