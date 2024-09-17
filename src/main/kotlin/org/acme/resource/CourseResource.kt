package org.acme.resource

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.acme.service.CourseService

@Path("/api/course")
class CourseResource(
    var courseService: CourseService
) {




    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    fun getAllCourses() = courseService.getAllCourses()
}