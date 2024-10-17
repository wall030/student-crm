package org.acme.resource

import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.acme.exception.ServiceException
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateStudentDTO
import org.acme.model.dto.StudentDTO
import org.acme.service.StudentService
import org.hamcrest.core.IsEqual.equalTo
import org.junit.jupiter.api.Test

@QuarkusTest
class StudentResourceTest {
    @InjectMock
    lateinit var studentService: StudentService

    @Test
    fun `test findAllStudents returns 200`() {
        val students = listOf(StudentDTO(1L, "Luke", "Skywalker", "luke@jedi.com", listOf(CourseDTO(1L, "Piloting 101"))))
        every { studentService.findAllStudents() } returns students

        given()
            .`when`().get("/api/student/all")
            .then()
            .statusCode(200)
            .body("$.size()", equalTo(1))
            .body("[0].firstName", equalTo("Luke"))
    }

    @Test
    fun `test findStudentByID returns 200 when student exists`() {
        val student = StudentDTO(1L, "Leia", "Organa", "leia@rebel.com")
        every { studentService.findStudent(1L) } returns student

        given()
            .`when`().get("/api/student/1")
            .then()
            .statusCode(200)
            .body("firstName", equalTo("Leia"))
    }

    @Test
    fun `test findStudentByID returns 404 when student does not exist`() {
        val studentID = 1L
        every { studentService.findStudent(studentID) } throws ServiceException.StudentNotFoundException(studentID.toString())

        given()
            .`when`().get("/api/student/1")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test createStudent returns 201`() {
        val createStudentDTO = CreateStudentDTO("Anakin", "Skywalker", "anakin@jedi.com")
        val createdStudent = StudentDTO(1L, "Anakin", "Skywalker", "anakin@jedi.com")
        every {
            studentService.createStudent(createStudentDTO.firstName, createStudentDTO.lastName, createStudentDTO.email)
        } returns createdStudent

        given()
            .contentType(ContentType.JSON)
            .body(createStudentDTO)
            .`when`().post("/api/student/create")
            .then()
            .statusCode(201)
            .body("firstName", equalTo("Anakin"))
    }

    @Test
    fun `test createStudent returns 409 when email already exists`() {
        val createStudentDTO = CreateStudentDTO("Anakin", "Skywalker", "anakin@jedi.com")
        every {
            studentService.createStudent(createStudentDTO.firstName, createStudentDTO.lastName, createStudentDTO.email)
        } throws ServiceException.DuplicateStudentException(createStudentDTO.email)

        given()
            .contentType(ContentType.JSON)
            .body(createStudentDTO)
            .`when`().post("/api/student/create")
            .then()
            .statusCode(409)
    }

    @Test
    fun `test updateStudent returns 200`() {
        val studentDTO = StudentDTO(1L, "Luke", "Skywalker", "luke@jedi.com")
        every {
            studentService.updateStudent(studentDTO.id, studentDTO.firstName, studentDTO.lastName, studentDTO.email)
        } returns studentDTO

        given()
            .contentType(ContentType.JSON)
            .body(studentDTO)
            .`when`().put("/api/student/update")
            .then()
            .statusCode(200)
            .body("firstName", equalTo("Luke"))
    }

    @Test
    fun `test updateStudent returns 404 when student does not exist`() {
        val studentDTO = StudentDTO(1L, "Luke", "Skywalker", "luke@jedi.com")
        every {
            studentService.updateStudent(studentDTO.id, studentDTO.firstName, studentDTO.lastName, studentDTO.email)
        } throws ServiceException.StudentNotFoundException(studentDTO.id.toString())

        given()
            .contentType(ContentType.JSON)
            .body(studentDTO)
            .`when`().put("/api/student/update")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test updateStudent returns 409 when email already exists`() {
        val studentDTO = StudentDTO(1L, "Luke", "Skywalker", "luke@jedi.com")
        every {
            studentService.updateStudent(studentDTO.id, studentDTO.firstName, studentDTO.lastName, studentDTO.email)
        } throws ServiceException.DuplicateStudentException(studentDTO.email)

        given()
            .contentType(ContentType.JSON)
            .body(studentDTO)
            .`when`().put("/api/student/update")
            .then()
            .statusCode(409)
    }

    @Test
    fun `test deleteStudents returns 204`() {
        val studentIDs = listOf(1L, 2L)

        every { studentService.deleteStudents(studentIDs) } just Runs

        given()
            .contentType(ContentType.JSON)
            .body(studentIDs)
            .`when`().delete("/api/student/delete")
            .then()
            .statusCode(204)
    }

    @Test
    fun `test deleteStudents returns 404 when student does not exist`() {
        val studentIDs = listOf(1L, 2L)
        every { studentService.deleteStudents(studentIDs) } throws ServiceException.StudentNotFoundException(studentIDs.toString())

        given()
            .contentType(ContentType.JSON)
            .body(listOf(1L, 2L))
            .`when`().delete("/api/student/delete")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test assignCourses returns 200`() {
        val studentID = 1L
        val courseIds = listOf(1L, 2L)
        val courses = listOf(CourseDTO(1L, "Starship Engineering"), CourseDTO(2L, "Piloting 101"))

        every { studentService.assignCourses(studentID, courseIds) } returns courses

        given()
            .contentType(ContentType.JSON)
            .body(courseIds)
            .`when`().put("/api/student/1/assignCourses")
            .then()
            .statusCode(200)
            .body("$.size()", equalTo(2))
            .body("[0].name", equalTo("Starship Engineering"))
    }

    @Test
    fun `test assignCourses returns 404 when student does not exist`() {
        val studentID = 1L
        val courseIds = listOf(1L, 2L)

        every { studentService.assignCourses(studentID, courseIds) } throws ServiceException.StudentNotFoundException(studentID.toString())

        given()
            .contentType(ContentType.JSON)
            .body(courseIds)
            .`when`().put("/api/student/1/assignCourses")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test assignCourses returns 404 when course does not exist`() {
        val studentID = 1L
        val courseIds = listOf(1L, 2L)

        every { studentService.assignCourses(studentID, courseIds) } throws ServiceException.CourseNotFoundException(courseIds.toString())

        given()
            .contentType(ContentType.JSON)
            .body(courseIds)
            .`when`().put("/api/student/1/assignCourses")
            .then()
            .statusCode(404)
    }
}
