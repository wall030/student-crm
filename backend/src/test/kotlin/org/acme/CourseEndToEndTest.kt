package org.acme

import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import io.restassured.response.Response
import jakarta.transaction.Transactional
import org.acme.model.dto.CourseCreateUpdateDTO
import org.acme.model.dto.StudentCreateUpdateDTO
import org.hamcrest.CoreMatchers.`is`
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

@QuarkusTest
class CourseEndToEndTest {
    // need to be lists for delete parameter when deleting in cleanup()
    private var courseIds = mutableListOf<Long>()
    private var studentIds = mutableListOf<Long>()

    @BeforeEach
    @Transactional
    fun setup() {
        val course = CourseCreateUpdateDTO("Piloting 101")
        val student = StudentCreateUpdateDTO("Han", "Solo", "han.solo@smuggler.com")

        val courseResponse: Response =
            given()
                .contentType(ContentType.JSON)
                .body(course)
                .post("/api/course/create")
                .then()
                .statusCode(201)
                .extract().response()

        courseIds.add(courseResponse.jsonPath().getLong("id"))

        val studentResponse: Response =
            given()
                .contentType(ContentType.JSON)
                .body(student)
                .post("/api/student/create")
                .then()
                .statusCode(201)
                .extract().response()

        studentIds.add(studentResponse.jsonPath().getLong("id"))
    }

    @AfterEach
    @Transactional
    fun cleanup() {
        given()
            .contentType(ContentType.JSON)
            .body(courseIds)
            .delete("/api/course/delete")
            .then()
            .statusCode(204)

        given()
            .contentType(ContentType.JSON)
            .body(studentIds)
            .delete("/api/student/delete")
            .then()
            .statusCode(204)

        studentIds.clear()
        courseIds.clear()
    }

    @Test
    fun `test findAllCourse returns 200`() {
        given()
            .`when`().get("/api/course/all")
            .then()
            .statusCode(200)
    }

    @Test
    fun `test findCourse returns 200 when course exists`() {
        given()
            .`when`().get("/api/course/${courseIds.first()}")
            .then()
            .statusCode(200)
            .body("name", `is`("Piloting 101"))
    }

    @Test
    fun `test findCourse returns 404 when course does not exist`() {
        val nonExistentCourseID = 999L
        given()
            .`when`().get("/api/course/$nonExistentCourseID")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test createCourse returns 201`() {
        val newCourse = CourseCreateUpdateDTO("New Course")
        val response: Response =
            given()
                .contentType(ContentType.JSON)
                .body(newCourse)
                .`when`().post("/api/course/create")
                .then()
                .statusCode(201)
                .extract().response()

        courseIds.add(response.jsonPath().getLong("id"))
    }

    @Test
    fun `test createCourse returns 409 when name already exists`() {
        val createCourseDTO = CourseCreateUpdateDTO("Piloting 101")
        given()
            .contentType(ContentType.JSON)
            .body(createCourseDTO)
            .`when`().post("/api/course/create")
            .then()
            .statusCode(409)
    }

    @Test
    fun `test updateCourse returns 200`() {
        val updateData = CourseCreateUpdateDTO("Piloting Advanced")

        given()
            .contentType(ContentType.JSON)
            .body(updateData)
            .`when`().put("/api/course/${courseIds.first()}/update")
            .then()
            .statusCode(200)
            .body("name", `is`("Piloting Advanced"))
    }

    @Test
    fun `test updateCourse returns 404 when course does not exist`() {
        val nonExistentCourseID = 999L
        val courseDTO = CourseCreateUpdateDTO("New Course Name")

        given()
            .contentType(ContentType.JSON)
            .body(courseDTO)
            .`when`().put("/api/course/$nonExistentCourseID/update")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test updateCourse returns 404 when course name already exists`() {
        val newCourse = CourseCreateUpdateDTO("New Course")

        val response: Response =
            given()
                .contentType(ContentType.JSON)
                .body(newCourse)
                .`when`().post("/api/course/create")
                .then()
                .statusCode(201)
                .extract().response()

        courseIds.add(response.jsonPath().getLong("id"))

        val updateCourseDTO = CourseCreateUpdateDTO("New Course")

        given()
            .contentType(ContentType.JSON)
            .body(updateCourseDTO)
            .`when`().put("/api/course/${courseIds.first()}/update")
            .then()
            .statusCode(409)
    }

    @Test
    fun `test deleteCourses returns 204`() {
        val courseIdsToDelete = courseIds

        given()
            .contentType(ContentType.JSON)
            .body(courseIdsToDelete)
            .`when`().delete("/api/course/delete")
            .then()
            .statusCode(204)

        courseIds.clear()
    }

    @Test
    fun `test deleteCourses returns 404 when course does not exist`() {
        val nonExistentCourseIDs = listOf(999L, 1000L)

        given()
            .contentType(ContentType.JSON)
            .body(nonExistentCourseIDs)
            .`when`().delete("/api/course/delete")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test assignStudents returns 200`() {
        val studentIdsToAssign = studentIds

        given()
            .contentType(ContentType.JSON)
            .body(studentIdsToAssign)
            .`when`().put("/api/course/${courseIds.first()}/assignStudents")
            .then()
            .statusCode(200)
            .body("size()", `is`(1))
            .body("[0].email", `is`("han.solo@smuggler.com"))
    }
}
