package org.acme.exception

sealed class ServiceException(message: String) : RuntimeException(message) {
    class StudentNotFoundException(studentIds: String) :
        ServiceException("Student not found with ID: $studentIds")

    class CourseNotFoundException(courseIds: String) :
        ServiceException("Course not found with ID: $courseIds")

    class DuplicateStudentException(email: String) :
        ServiceException("Student with email $email already exists")

    class DuplicateCourseException(name: String) :
        ServiceException("Course titled $name already exists")
}
