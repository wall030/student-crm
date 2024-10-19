package org.acme.resource

import jakarta.validation.Valid
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType
import org.acme.model.dto.StudentCreateUpdateDTO
import org.acme.service.StudentService
import org.jboss.resteasy.reactive.ResponseStatus

@Path("/api/student")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class StudentResource(
    val studentService: StudentService,
) {
    @GET
    @ResponseStatus(200)
    @Path("/all")
    fun findAllStudents() = studentService.findAllStudents()

    @GET
    @ResponseStatus(200)
    @Path("/")
    fun findStudents(
        @QueryParam("page") page: Int,
        @QueryParam("limit") limit: Int,
        @QueryParam("search") search: String,
    ) = studentService.findStudents(page, limit, search)

    @GET
    @ResponseStatus(200)
    @Path("/{id}")
    fun findStudentByID(
        @PathParam("id") id: Long,
    ) = studentService.findStudent(id)

    @POST
    @ResponseStatus(201)
    @Path("/create")
    fun createStudent(
        @Valid student: StudentCreateUpdateDTO,
    ) = studentService.createStudent(student.firstName, student.lastName, student.email)

    @PUT
    @ResponseStatus(200)
    @Path("/{id}/update")
    fun updateStudent(@PathParam("id") id: Long, student: StudentCreateUpdateDTO) = studentService.updateStudent(id, student.firstName, student.lastName, student.email)

    @DELETE
    @ResponseStatus(204)
    @Path("/delete")
    fun deleteStudents(studentIDs: List<Long>) = studentService.deleteStudents(studentIDs)

    @PUT
    @ResponseStatus(200)
    @Path("/{id}/assignCourses")
    fun assignCourses(
        @PathParam("id") id: Long,
        courses: List<Long>,
    ) = studentService.assignCourses(id, courses)
}
