package org.acme.resource

import jakarta.transaction.Transactional
import jakarta.validation.Valid
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import org.acme.model.dto.CourseDTO
import org.acme.model.dto.CreateCourseDTO
import org.acme.service.CourseService

@Path("/api/course")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class CourseResource(
    var courseService: CourseService,
) {
    @GET
    @Path("/all")
    fun getAllCourses(): Response {
        val courses = courseService.findAllCourses()
        return Response.ok(courses).build()
    }

    @GET
    @Path("/{id}")
    fun findCourse(id: Long): Response {
        return courseService.findCourse(id)?.let {
            Response.ok(it).build()
        } ?: Response.status(Response.Status.NOT_FOUND).build()
    }

    @Transactional
    @POST
    @Path("/create")
    fun createCourse(
        @Valid courseDTO: CreateCourseDTO,
    ): Response {
        val createdCourse = courseService.createCourse(courseDTO)
        return Response.status(Response.Status.CREATED).entity(createdCourse).build()
    }

    @Transactional
    @PUT
    @Path("/update")
    fun updateCourse(updatedCourseDTO: CourseDTO): Response {
        val updatedCourse = courseService.updateCourse(updatedCourseDTO)
        return Response.ok(updatedCourse).build()
    }

    @Transactional
    @DELETE
    @Path("/delete")
    fun deleteCourses(courses: List<Long>): Response {
        if (courses.isNotEmpty()) {
            courseService.deleteCourses(courses)
        }
        return Response.noContent().build()
    }
}
