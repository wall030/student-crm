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
import org.acme.model.dto.CourseCreateUpdateDTO
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
    @Path("/")
    fun findStudents(
        @QueryParam("page") page: Int,
        @QueryParam("limit") limit: Int,
        @QueryParam("search") search: String,
    ) = courseService.findCourses(page, limit, search)

    @GET
    @ResponseStatus(200)
    @Path("/{id}")
    fun findCourse(id: Long) = courseService.findCourse(id)

    @POST
    @ResponseStatus(201)
    @Path("/create")
    fun createCourse(
        @Valid courseDTO: CourseCreateUpdateDTO,
    ) = courseService.createCourse(courseDTO.name)

    @PUT
    @ResponseStatus(200)
    @Path("/{id}/update")
    fun updateCourse(
        @PathParam("id") id: Long,
        courseDTO: CourseCreateUpdateDTO,
    ) = courseService.updateCourse(id, courseDTO.name)

    @DELETE
    @ResponseStatus(204)
    @Path("/delete")
    fun deleteCourses(courses: List<Long>) = courseService.deleteCourses(courses)

    @PUT
    @ResponseStatus(200)
    @Path("/{id}/assignStudents")
    fun assignStudents(
        @PathParam("id") id: Long,
        students: List<Long>,
    ) = courseService.assignStudents(id, students)
}
