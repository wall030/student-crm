package org.acme.resource

import io.mockk.every
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import jakarta.inject.Inject
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentCreateUpdateDTO
import org.acme.model.dto.StudentDTO
import org.acme.service.StudentService
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.CoreMatchers.`is`
import org.junit.jupiter.api.Test

@QuarkusTest
class StudentResourceTest {
    @InjectMock
    private lateinit var studentService: StudentService

    @Inject
    private lateinit var studentResource: StudentResource

    private var student1 = StudentDTO(1L, "Luke", "Skywalker", "luke@jedi.com")
    private val studentsList = listOf(student1)
    private val studentIds = listOf(student1.id)

    private var course1 = CourseDTO(1L, "Piloting 101")
    private val coursesList = listOf(course1)
    private val courseIds = listOf<Long>(course1.id)

    @Test
    fun `findAllStudents returns a list with all students`() {
        every { studentResource.findAllStudents() } returns studentsList
        given()
            .`when`().get("/api/student/all")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("[0].id", equalTo(student1.id.toInt()))
            .body("[0].firstName", `is`(student1.firstName))
            .body("[0].lastName", `is`(student1.lastName))
            .body("[0].email", `is`(student1.email))
            .body("[0].courses.size()", equalTo(0))
    }

    @Test
    fun `findStudent returns a student`() {
        every { studentResource.findStudent(any()) } returns student1
        given()
            .`when`().get("/api/student/${studentIds.first()}")
            .then()
            .statusCode(200)
            .body("id", equalTo(student1.id.toInt()))
            .body("firstName", `is`(student1.firstName))
            .body("lastName", `is`(student1.lastName))
            .body("email", `is`(student1.email))
            .body("courses.size()", equalTo(0))
    }

    @Test
    fun `createStudent returns created student`() {
        val createUpdateDTO = StudentCreateUpdateDTO(student1.firstName, student1.lastName, student1.email)
        every { studentResource.createStudent(createUpdateDTO) } returns student1
        given()
            .contentType(ContentType.JSON)
            .body(createUpdateDTO)
            .`when`().post("/api/student/create")
            .then()
            .statusCode(201)
            .body("id", equalTo(student1.id.toInt()))
            .body("firstName", `is`(student1.firstName))
            .body("lastName", `is`(student1.lastName))
            .body("email", `is`(student1.email))
            .body("courses.size()", equalTo(0))
    }

    @Test
    fun `updateStudent returns updated student`() {
        val createUpdateDTO = StudentCreateUpdateDTO(student1.firstName, student1.lastName, student1.email)
        every { studentResource.updateStudent(student1.id, createUpdateDTO) } returns student1
        given()
            .contentType(ContentType.JSON)
            .body(createUpdateDTO)
            .`when`().put("/api/student/${studentIds.first()}/update")
            .then()
            .statusCode(200)
            .body("id", equalTo(student1.id.toInt()))
            .body("firstName", `is`(student1.firstName))
            .body("lastName", `is`(student1.lastName))
            .body("email", `is`(student1.email))
            .body("courses.size()", equalTo(0))
    }

    @Test
    fun `deleteStudents returns 204 no content`() {
        every { studentResource.deleteStudents(any()) } returns true
        given()
            .contentType(ContentType.JSON)
            .body(studentIds)
            .`when`().delete("/api/student/delete")
            .then()
            .statusCode(204)
    }

    @Test
    fun `assignCourses returns list of assigned courses `() {
        every { studentResource.assignCourses(student1.id, courseIds) } returns coursesList
        given()
            .contentType(ContentType.JSON)
            .body(courseIds)
            .`when`().put("/api/student/${studentIds.first()}/assignCourses")
            .then()
            .statusCode(200)
            .body("size()", `is`(coursesList.size))
            .body("[0].name", `is`(course1.name))
    }
}
