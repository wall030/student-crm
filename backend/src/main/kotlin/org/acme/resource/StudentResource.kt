package org.acme.resource

import jakarta.transaction.Transactional
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.acme.model.dto.CreateStudentDTO
import org.acme.model.dto.StudentDTO
import org.acme.service.StudentService

@Path("/api/student")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class StudentResource(
    val studentService: StudentService,
) {
    @GET
    @Path("/all")
    fun findAllStudents(): Response {
        val students = studentService.findAllStudents()
        return Response.ok(students).build()
    }

    @GET
    @Path("/{id}")
    fun findStudentByID(
        @PathParam("id") id: Long,
    ): Response {
        return studentService.findStudent(id)?.let {
            Response.ok(it).build()
        } ?: Response.status(Response.Status.NOT_FOUND).build()
    }

    @Transactional
    @POST
    @Path("/create")
    fun createStudent(student: CreateStudentDTO): Response {
        val createdStudent = studentService.createStudent(student)
        return Response.status(Response.Status.CREATED).entity(createdStudent).build()
    }

    @Transactional
    @PUT
    @Path("/update")
    fun updateStudent(student: StudentDTO): Response {
        val updatedStudent = studentService.updateStudent(student)
        return Response.ok(updatedStudent).build()
    }

    @Transactional
    @DELETE
    @Path("/delete")
    fun deleteStudents(studentIDs: List<Long>): Response {
        studentService.deleteStudents(studentIDs)
        return Response.noContent().build()
    }

    @Transactional
    @PUT
    @Path("/{id}/assignCourses")
    fun assignCourses(
        @PathParam("id") id: Long,
        courses: List<Long>,
    ): Response {
        val updatedStudent = studentService.assignCourses(id, courses)
        return Response.ok(updatedStudent).build()
    }

    @Transactional
    @PUT
    @Path("/{id}/removeCourses")
    fun removeCourses(
        @PathParam("id") id: Long,
        courses: List<Long>,
    ): Response {
        val updatedStudent = studentService.removeCourses(id, courses)
        return Response.ok(updatedStudent).build()
    }
}
