package org.acme.exception

import jakarta.ws.rs.core.Response
import org.acme.exception.ServiceException.CourseNotFoundException
import org.acme.exception.ServiceException.DuplicateCourseException
import org.acme.exception.ServiceException.DuplicateStudentException
import org.acme.exception.ServiceException.StudentNotFoundException
import org.jboss.resteasy.reactive.server.ServerExceptionMapper

class ExceptionHandler {
    @ServerExceptionMapper
    fun handleServiceExceptions(ex: ServiceException): Response =
        when (ex) {
            is StudentNotFoundException,
            is CourseNotFoundException,
            -> createErrorResponse(Response.Status.NOT_FOUND, ex.message)
            is DuplicateStudentException,
            is DuplicateCourseException,
            -> createErrorResponse(Response.Status.CONFLICT, ex.message)
        }

    @ServerExceptionMapper
    fun handleGeneralExceptions(ex: Exception): Response {
        return createErrorResponse(Response.Status.INTERNAL_SERVER_ERROR, "An unexpected error occurred.")
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
