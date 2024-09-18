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
import org.acme.model.Course
import org.acme.model.Student
import org.acme.service.StudentService
import org.jboss.resteasy.reactive.RestResponse
import org.jboss.resteasy.reactive.RestResponse.ResponseBuilder

@Path("/api/student")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class StudentResource(
    val studentService: StudentService
) {

    @GET
    @Path("/all")
    fun findAllStudents(): RestResponse<String> {
        val students = studentService.findAllStudents()
        return ResponseBuilder.ok("All students successfully found").build()
    }

    @GET
    @Path("/{id}")
    fun findStudentByID(@PathParam("id") id: Long) : RestResponse<Student> {
        var foundStudent = studentService.findStudent(id)
        return ResponseBuilder.ok(foundStudent).build()
    }

    @Transactional
    @POST
    @Path("/create")
    fun createStudent(student: Student) : RestResponse<String> {
        studentService.createStudent(student)
        return ResponseBuilder.ok("Student successfully created").build()
    }

    @Transactional
    @PUT
    @Path("/update")
    fun updateStudent(student: Student) : RestResponse<String> {
        studentService.updateStudent(student)
        return ResponseBuilder.ok("Student successfully updated").build()
    }

    @Transactional
    @DELETE
    @Path("/delete")
    fun deleteStudents(students: List<Student>): RestResponse<String> {
        studentService.deleteStudents(students)
        return ResponseBuilder.ok("Student/s successfully deleted").build()

    }

}