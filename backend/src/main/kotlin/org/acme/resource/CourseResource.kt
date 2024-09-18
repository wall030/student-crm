package org.acme.resource

import jakarta.transaction.Transactional
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import org.acme.model.Course
import org.acme.model.Student
import org.acme.service.CourseService
import org.jboss.resteasy.reactive.RestResponse
import org.jboss.resteasy.reactive.RestResponse.ResponseBuilder

@Path("/api/course")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class CourseResource(
    var courseService: CourseService
) {


    @GET
    @Path("/all")
    fun getAllCourses() = courseService.getAllCourses()

    @GET
    @Path("/findByID")
    fun findCourseByID(course: Course) : RestResponse<Course> {
        var foundCourse = courseService.findCourse(course)
        return ResponseBuilder.ok(foundCourse).build()
    }

    @Transactional
    @POST
    @Path("/create")
    fun createStudent(course: Course) : RestResponse<String> {
        courseService.createCourse(course)
        return ResponseBuilder.ok("Course successfully created").build()
    }

    @Transactional
    @PUT
    @Path("/update")
    fun updateStudent(course: Course) : RestResponse<String> {
        courseService.updateCourse(course)
        return ResponseBuilder.ok("Course successfully updated").build()
    }

    @Transactional
    @DELETE
    @Path("/delete")
    fun deleteStudents(courses: List<Course>): RestResponse<String> {
        courseService.deleteCourses(courses)
        return ResponseBuilder.ok("Course/s successfully deleted").build()

    }
}