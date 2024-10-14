package org.acme.resource

import jakarta.validation.Valid
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateCourseDTO
import org.acme.service.CourseService
import org.jboss.resteasy.reactive.ResponseStatus

@Path("/api/course")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class CourseResource(
    var courseService: CourseService,
) {
    @GET
    @ResponseStatus(200)
    @Path("/all")
    fun findAllCourses() = courseService.findAllCourses()

    @GET
    @ResponseStatus(200)
    @Path("/{id}")
    fun findCourse(id: Long) = courseService.findCourse(id)

    @POST
    @ResponseStatus(201)
    @Path("/create")
    fun createCourse(
        @Valid courseDTO: CreateCourseDTO,
    ) = courseService.createCourse(courseDTO.name)

    @PUT
    @ResponseStatus(200)
    @Path("/update")
    fun updateCourse(
        @Valid courseDTO: CourseDTO,
    ) = courseService.updateCourse(courseDTO.id, courseDTO.name)

    @DELETE
    @ResponseStatus(204)
    @Path("/delete")
    fun deleteCourses(courses: List<Long>) = courseService.deleteCourses(courses)
}
