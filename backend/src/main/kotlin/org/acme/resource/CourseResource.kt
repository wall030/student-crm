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
import org.acme.model.Course
import org.acme.model.Student
import org.acme.service.CourseService
import org.jboss.resteasy.reactive.ResponseStatus
import org.jboss.resteasy.reactive.RestResponse
import org.jboss.resteasy.reactive.RestResponse.ResponseBuilder

@Path("/api/course")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class CourseResource(
    var courseService: CourseService
) {


    @GET
    @ResponseStatus(200)
    @Path("/all")
    fun getAllCourses() = courseService.getAllCourses()

    @GET
    @ResponseStatus(200)
    @Path("/{id}")
    fun findCourseByID(@PathParam("id") id: Long) = courseService.findCourse(id)

    @Transactional
    @POST
    @ResponseStatus(201)
    @Path("/create")
    fun createStudent(course: Course) = courseService.createCourse(course)

    @Transactional
    @PUT
    @ResponseStatus(200)
    @Path("/update")
    fun updateStudent(course: Course) = courseService.updateCourse(course)

    @Transactional
    @DELETE
    @ResponseStatus(204)
    @Path("/delete")
    fun deleteStudents(courses: List<Course>) = courseService.deleteCourses(courses)
}