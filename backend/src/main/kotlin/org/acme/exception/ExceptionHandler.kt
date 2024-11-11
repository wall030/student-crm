package org.acme.exception

import jakarta.ws.rs.core.Response
import org.jboss.resteasy.reactive.server.ServerExceptionMapper

class ExceptionHandler {
    @ServerExceptionMapper
    fun handleServiceExceptions(ex: ServiceException): Response {
        val errorCode = ErrorCode.fromException(ex)
        return createErrorResponse(Response.Status.fromStatusCode(getHttpStatus(errorCode)), errorCode.code)
    }

    @ServerExceptionMapper
    fun handleGeneralExceptions(ex: Exception): Response {
        return createErrorResponse(Response.Status.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR.code)
    }

    private fun createErrorResponse(
        status: Response.Status,
        errorCode: Int,
    ): Response {
        return Response.status(status)
            .entity(mapOf("errorCode" to errorCode))
            .build()
    }

    private fun getHttpStatus(errorCode: ErrorCode): Int =
        when (errorCode) {
            ErrorCode.STUDENT_NOT_FOUND, ErrorCode.COURSE_NOT_FOUND -> Response.Status.NOT_FOUND.statusCode
            ErrorCode.DUPLICATE_STUDENT, ErrorCode.DUPLICATE_COURSE -> Response.Status.CONFLICT.statusCode
            ErrorCode.INTERNAL_ERROR -> Response.Status.INTERNAL_SERVER_ERROR.statusCode
        }
}
