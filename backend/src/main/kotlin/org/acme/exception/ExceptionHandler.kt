package org.acme.exception

import jakarta.ws.rs.core.Response
import org.jboss.resteasy.reactive.server.ServerExceptionMapper

class ExceptionHandler {
    @ServerExceptionMapper
    fun handleServiceExceptions(ex: ServiceException): Response =
        when (ex) {
            is ServiceException.StudentNotFoundException -> createErrorResponse(Response.Status.NOT_FOUND, ex.message)
            is ServiceException.CourseNotFoundException -> createErrorResponse(Response.Status.NOT_FOUND, ex.message)
            is ServiceException.DuplicateStudentException -> createErrorResponse(Response.Status.CONFLICT, ex.message)
            is ServiceException.DuplicateCourseException -> createErrorResponse(Response.Status.CONFLICT, ex.message)
        }

    private fun createErrorResponse(
        status: Response.Status,
        message: String?,
    ): Response {
        return Response.status(status)
            .entity(mapOf("error" to message))
            .build()
    }
}
