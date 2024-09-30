package org.acme.resource

import io.mockk.every
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.acme.model.Course
import org.acme.model.dto.CreateCourseDTO
import org.acme.service.CourseService
import org.hamcrest.core.IsEqual.equalTo
import org.junit.jupiter.api.Test

@QuarkusTest
class CourseResourceTest {
    @InjectMock
    lateinit var courseService: CourseService

    @Test
    fun `test getAllCourses returns 200`() {
        val courses = listOf(Course(1L, "Course 1"), Course(2L, "Course 2"))
        every { courseService.findAllCourses() } returns courses

        given()
            .`when`().get("/api/course/all")
            .then()
            .statusCode(200)
            .body("$.size()", equalTo(2))
            .body("[0].name", equalTo("Course 1"))
            .body("[1].name", equalTo("Course 2"))
    }

    @Test
    fun `test findCourse returns 200 when course exists`() {
        val course = Course(1L, "Course 1")
        every { courseService.findCourse(1L) } returns course

        given()
            .`when`().get("/api/course/1")
            .then()
            .statusCode(200)
            .body("name", equalTo("Course 1"))
    }

    @Test
    fun `test findCourse returns 404 when course does not exist`() {
        every { courseService.findCourse(1L) } returns null

        given()
            .`when`().get("/api/course/1")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test createCourse returns 201`() {
        val createCourseDTO = CreateCourseDTO("New Course")
        val createdCourse = Course(1L, "New Course")
        every { courseService.createCourse(createCourseDTO) } returns createdCourse

        given()
            .contentType(ContentType.JSON)
            .body(createCourseDTO)
            .`when`().post("/api/course/create")
            .then()
            .statusCode(201)
            .body("name", equalTo("New Course"))
    }
}
