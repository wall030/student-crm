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

    @Test
    fun `test findCourse returns 404 when course does not exist`() {
        val courseID = 1L

        every { courseService.findCourse(courseID) } throws ServiceException.CourseNotFoundException(courseID.toString())

        given()
            .`when`().get("/api/course/1")
            .then()
            .statusCode(404)
    }

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
    fun `test createCourse returns 409 when name already exists`() {
        val createCourseDTO = CreateCourseDTO("Piloting 101")

        every {
            courseService.createCourse(createCourseDTO.name)
        } throws ServiceException.DuplicateCourseException(createCourseDTO.name)

        given()
            .contentType(ContentType.JSON)
            .body(createCourseDTO)
            .`when`().post("/api/course/create")
            .then()
            .statusCode(409)
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
    fun `test updateCourse returns 404 when course does not exist`() {
        val courseDTO = CourseDTO(1L, "Piloting 101")

        every {
            courseService.updateCourse(courseDTO.id, courseDTO.name)
        } throws ServiceException.CourseNotFoundException(courseDTO.id.toString())

        given()
            .contentType(ContentType.JSON)
            .body(courseDTO)
            .`when`().put("/api/course/update")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test updateCourse returns 409 when course already exists`() {
        val courseDTO = CourseDTO(1L, "Piloting 101")

        every {
            courseService.updateCourse(courseDTO.id, courseDTO.name)
        } throws ServiceException.DuplicateCourseException(courseDTO.name)

        given()
            .contentType(ContentType.JSON)
            .body(courseDTO)
            .`when`().put("/api/course/update")
            .then()
            .statusCode(409)
    }

    @Test
    fun `test deleteCourse returns 204`() {
        val courseIDs = listOf(1L, 2L)

        every { courseService.deleteCourses(courseIDs) } just Runs

        given()
            .contentType(ContentType.JSON)
            .body(courseIDs)
            .`when`().delete("/api/course/delete")
            .then()
            .statusCode(204)
    }

    @Test
    fun `test deleteStudents returns 404 when course does not exist`() {
        val courseIDs = listOf(1L, 2L)

        every { courseService.deleteCourses(courseIDs) } throws ServiceException.StudentNotFoundException(courseIDs.toString())

        given()
            .contentType(ContentType.JSON)
            .body(courseIDs)
            .`when`().delete("/api/course/delete")
            .then()
            .statusCode(404)
    }
}
