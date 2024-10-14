package org.acme.resource

import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.quarkiverse.test.junit.mockk.InjectMock
import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateCourseDTO
import org.acme.service.CourseService
import org.hamcrest.core.IsEqual.equalTo
import org.junit.jupiter.api.Test

@QuarkusTest
class CourseResourceTest {
    @InjectMock
    lateinit var courseService: CourseService

    @Test
    fun `test findAllCourses returns 200`() {
        val courses = listOf(CourseDTO(1L, "Starship Engineering"), CourseDTO(2L, "Piloting 101"))
        every { courseService.findAllCourses() } returns courses

        given()
            .`when`().get("/api/course/all")
            .then()
            .statusCode(200)
            .body("$.size()", equalTo(2))
            .body("[0].name", equalTo("Starship Engineering"))
            .body("[1].name", equalTo("Piloting 101"))
    }

    @Test
    fun `test findCourse returns 200 when course exists`() {
        val course = CourseDTO(1L, "Piloting 101")
        every { courseService.findCourse(1L) } returns course

        given()
            .`when`().get("/api/course/1")
            .then()
            .statusCode(200)
            .body("name", equalTo("Piloting 101"))
    }

    /*
        @Test
        fun `test findCourse returns 404 when course does not exist`() {
            every { courseService.findCourse(1L) } returns null

            given()
                .`when`().get("/api/course/1")
                .then()
                .statusCode(404)
        }
     */
    @Test
    fun `test createCourse returns 201`() {
        val createCourseDTO = CreateCourseDTO("Piloting 101")
        val createdCourse = CourseDTO(1L, "Piloting 101")
        every { courseService.createCourse(createCourseDTO.name) } returns createdCourse

        given()
            .contentType(ContentType.JSON)
            .body(createCourseDTO)
            .`when`().post("/api/course/create")
            .then()
            .statusCode(201)
            .body("name", equalTo("Piloting 101"))
    }

    @Test
    fun `test updateCourse returns 200`() {
        val courseDTO = CourseDTO(1L, "Piloting 101")
        every { courseService.updateCourse(courseDTO.id, courseDTO.name) } returns courseDTO

        given()
            .contentType(ContentType.JSON)
            .body(courseDTO)
            .`when`().put("/api/course/update")
            .then()
            .statusCode(200)
            .body("name", equalTo("Piloting 101"))
    }

    @Test
    fun `test deleteCourse returns 204`() {
        every { courseService.deleteCourses(any()) } just Runs

        given()
            .contentType(ContentType.JSON)
            .body(listOf(1L, 2L))
            .`when`().delete("/api/student/delete")
            .then()
            .statusCode(204)
    }
}
