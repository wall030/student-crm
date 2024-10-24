package org.acme.resource

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
class StudentResourceTest {

    // need to be lists for delete parameter when deleting in cleanup()
    private var courseIds = mutableListOf<Long>()
    private var studentIds = mutableListOf<Long>()

    @BeforeEach
    @Transactional
    fun setup() {
        val course = CourseCreateUpdateDTO("Piloting 101")
        val student = StudentCreateUpdateDTO("Han", "Solo", "han.solo@smuggler.com")

        val courseResponse: Response = given()
            .contentType(ContentType.JSON)
            .body(course)
            .post("/api/course/create")
            .then()
            .statusCode(201)
            .extract().response()

        courseIds.add(courseResponse.jsonPath().getLong("id"))

        val studentResponse: Response = given()
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

        if (courseIds.isNotEmpty()) {
            given()
                .contentType(ContentType.JSON)
                .body(courseIds)
                .delete("/api/course/delete")
                .then()
                .statusCode(204)
        }

        if (studentIds.isNotEmpty()) {
            given()
                .contentType(ContentType.JSON)
                .body(studentIds)
                .delete("/api/student/delete")
                .then()
                .statusCode(204)
        }

        studentIds.clear()
        courseIds.clear()
    }

    @Test
    fun `test findAllStudents returns 200`() {
        given()
            .`when`().get("/api/student/all")
            .then()
            .statusCode(200)
    }

    @Test
    fun `test findStudentByID returns 200 when student exists`() {
        given()
            .`when`().get("/api/student/${studentIds.first()}")
            .then()
            .statusCode(200)
            .body("email", `is`("han.solo@smuggler.com"))
    }

    @Test
    fun `test findStudentByID returns 404 when student does not exist`() {
        val nonExistentStudent = 999L
        given()
            .`when`().get("/api/student/$nonExistentStudent")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test createStudent returns 201`() {
        val newStudent = StudentCreateUpdateDTO("Boba", "Fett", "boba.fett@bounty.com")
        given()
            .contentType(ContentType.JSON)
            .body(newStudent)
            .`when`().post("/api/student/create")
            .then()
            .statusCode(201)
            .body("firstName", `is`("Boba"))
            .body("lastName", `is`("Fett"))
            .body("email", `is`("boba.fett@bounty.com"))

    }

    @Test
    fun `test createStudent returns 409 when email already exists`() {
        val createStudentDTO = StudentCreateUpdateDTO("Han", "Solo", "han.solo@smuggler.com")
        given()
            .contentType(ContentType.JSON)
            .body(createStudentDTO)
            .`when`().post("/api/student/create")
            .then()
            .statusCode(409)
    }

    @Test
    fun `test updateStudent returns 200`() {
        val updateStudentDTO = StudentCreateUpdateDTO("Han", "Duo", "han.duo@smuggler.com")

        given()
            .contentType(ContentType.JSON)
            .body(updateStudentDTO)
            .`when`().put("/api/student/${studentIds.first()}/update")
            .then()
            .statusCode(200)
            .body("firstName", `is`("Han"))
            .body("lastName", `is`("Duo"))
            .body("email", `is`("han.duo@smuggler.com"))
    }

    @Test
    fun `test updateStudent returns 404 when student does not exist`() {
        val nonExistentStudentID = 999L
        val updateStudentDTO = StudentCreateUpdateDTO("Han", "Duo", "han.duo@smuggler.com")

        given()
            .contentType(ContentType.JSON)
            .body(updateStudentDTO)
            .`when`().put("/api/student/$nonExistentStudentID/update")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test updateStudent returns 409 when email already exists`() {
        val newStudent = StudentCreateUpdateDTO("Han", "Duo", "han.duo@smuggler.com")
        given()
            .contentType(ContentType.JSON)
            .body(newStudent)
            .`when`().post("/api/student/create")
            .then()
            .statusCode(201)

        val updateStudentDTO = StudentCreateUpdateDTO("Han", "Solo", "han.duo@smuggler.com")
        given()
            .contentType(ContentType.JSON)
            .body(updateStudentDTO)
            .`when`().put("/api/student/${studentIds.first()}/update")   // reference Han Solo, update email to han.duo@smuggler.com
            .then()
            .statusCode(409)
    }

    @Test
    fun `test deleteStudents returns 204`() {
        val studentIdsToDelete = studentIds

        given()
            .contentType(ContentType.JSON)
            .body(studentIdsToDelete)
            .`when`().delete("/api/student/delete")
            .then()
            .statusCode(204)

        studentIds.clear()
    }

    @Test
    fun `test deleteStudents returns 404 when student does not exist`() {
        val nonExistentStudentIDs = listOf(999L, 1000L)

        given()
            .contentType(ContentType.JSON)
            .body(nonExistentStudentIDs)
            .`when`().delete("/api/student/delete")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test assignCourses returns 200`() {
        val courseIdsToAssign = courseIds
        given()
            .contentType(ContentType.JSON)
            .body(courseIdsToAssign)
            .`when`().put("/api/student/${studentIds.first()}/assignCourses")
            .then()
            .statusCode(200)
            .body("size()", `is`(1))
            .body("[0].name", `is`("Piloting 101"))
    }

    @Test
    fun `test assignCourses returns 404 when student does not exist`() {
        val nonExistentStudentID = 999L
        val courseIdsToAssign = courseIds

        given()
            .contentType(ContentType.JSON)
            .body(courseIdsToAssign)
            .`when`().put("/api/student/$nonExistentStudentID/assignCourses")
            .then()
            .statusCode(404)
    }

    @Test
    fun `test assignCourses returns 404 when course does not exist`() {
        val courseIdsToAssign = listOf(99L)
        given()
            .contentType(ContentType.JSON)
            .body(courseIdsToAssign)
            .`when`().put("/api/student/${studentIds.first()}/assignCourses")
            .then()
            .statusCode(404)
    }
}
