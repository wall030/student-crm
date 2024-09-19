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
import org.acme.model.dto.CreateStudentDTO
import org.acme.model.dto.StudentDTO
import org.acme.service.StudentService
import org.jboss.resteasy.reactive.ResponseStatus

@Path("/api/student")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class StudentResource(
    val studentService: StudentService
) {

    @GET
    @ResponseStatus(200)
    @Path("/all")
    fun findAllStudents() = studentService.findAllStudents()

    @GET
    @ResponseStatus(200)
    @Path("/{id}")
    fun findStudentByID(@PathParam("id") id: Long) = studentService.findStudent(id)


    @Transactional
    @POST
    @ResponseStatus(201)
    @Path("/create")
    fun createStudent(student: CreateStudentDTO) = studentService.createStudent(student)


    @Transactional
    @PUT
    @ResponseStatus(200)
    @Path("/update")
    fun updateStudent(student: StudentDTO) = studentService.updateStudent(student)

    @Transactional
    @DELETE
    @ResponseStatus(204)
    @Path("/delete")
    fun deleteStudents(studentIDs: List<Long>) = studentService.deleteStudents(studentIDs)

    @Transactional
    @PUT
    @Path("/{id}/assignCourses")
    fun assignCourses(@PathParam("id") id: Long,  courses: List<Long>) = studentService.assignCourses(id, courses)

}