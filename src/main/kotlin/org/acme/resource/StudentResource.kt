package org.acme.resource

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.acme.service.StudentService

@Path("/api/student")
class StudentResource(
    var studentService: StudentService
) {




    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    fun getAllStudents() = studentService.getAllStudents()
}