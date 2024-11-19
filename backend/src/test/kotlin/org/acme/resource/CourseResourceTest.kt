package org.acme.resource

import io.mockk.every
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import jakarta.inject.Inject
import org.acme.model.dto.CourseCreateUpdateDTO
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.StudentDTO
import org.acme.service.CourseService
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.CoreMatchers.`is`
import org.junit.jupiter.api.Test

@QuarkusTest
class CourseResourceTest {
    @InjectMock
    private lateinit var mockCourseService: CourseService

    @Inject
    private lateinit var courseResource: CourseResource

    private val student1 = StudentDTO(1L, "Luke", "Skywalker", "luke@jedi.com")
    private val studentsList = listOf(student1)
    private val studentIds = listOf(student1.id)

    private val course1 = CourseDTO(1L, "Piloting 101")
    private val coursesList = listOf(course1)
    private val courseIds = listOf<Long>(course1.id)

    @Test
    fun `findAllCourse returns a list with all courses`() {
        every { courseResource.findAllCourses() } returns coursesList
        given()
            .`when`().get("/api/course/all")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("[0].id", equalTo(course1.id.toInt()))
            .body("[0].name", equalTo(course1.name))
            .body("[0].students.size()", equalTo(0))
    }

    @Test
    fun `findCourse returns a course`() {
        every { courseResource.findCourse(any()) } returns course1
        given()
            .`when`().get("/api/course/${courseIds.first()}")
            .then()
            .statusCode(200)
            .body("id", equalTo(course1.id.toInt()))
            .body("name", `is`(course1.name))
    }

    @Test
    fun `createCourse returns created course`() {
        every { courseResource.createCourse(CourseCreateUpdateDTO(course1.name)) } returns course1
        given()
            .contentType(ContentType.JSON)
            .body(CourseCreateUpdateDTO(course1.name))
            .`when`().post("/api/course/create")
            .then()
            .statusCode(201)
            .body("id", equalTo(course1.id.toInt()))
            .body("name", `is`(course1.name))
    }

    @Test
    fun `updateCourse returns updated course`() {
        every { courseResource.updateCourse(course1.id, CourseCreateUpdateDTO(course1.name)) } returns course1
        given()
            .contentType(ContentType.JSON)
            .body(CourseCreateUpdateDTO(course1.name))
            .`when`().put("/api/course/${courseIds.first()}/update")
            .then()
            .statusCode(200)
            .body("id", equalTo(course1.id.toInt()))
            .body("name", `is`(course1.name))
    }

    @Test
    fun `deleteCourses returns 204 no content`() {
        every { courseResource.deleteCourses(any()) } returns true
        given()
            .contentType(ContentType.JSON)
            .body(courseIds)
            .`when`().delete("/api/course/delete")
            .then()
            .statusCode(204)
    }

    @Test
    fun `test assignStudents returns list of assigned students`() {
        every { courseResource.assignStudents(course1.id, studentIds) } returns studentsList
        given()
            .contentType(ContentType.JSON)
            .body(studentIds)
            .`when`().put("/api/course/${courseIds.first()}/assignStudents")
            .then()
            .statusCode(200)
            .body("size()", `is`(courseIds.size))
            .body("[0].firstName", `is`(student1.firstName))
            .body("[0].lastName", `is`(student1.lastName))
            .body("[0].email", `is`(student1.email))
            .body("[0].courses.size()", equalTo(0))
    }
}
