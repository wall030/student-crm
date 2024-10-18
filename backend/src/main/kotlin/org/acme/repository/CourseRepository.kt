package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheQuery
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course
import org.acme.model.Student

@ApplicationScoped
class CourseRepository : PanacheRepositoryBase<Course, Long> {
    @Transactional
    fun deleteByIds(ids: List<Long>) = delete("id in ?1", ids)

    fun findByIds(ids: List<Long>): List<Course> {
        return find("id in ?1", ids).list()
    }

    fun findByName(name: String): Course? {
        return find("name", name).firstResult<Course>()
    }

    fun findCourses(
        page: Int,
        limit: Int,
        search: String?,
    ): List<Course> {
        return if (!search.isNullOrBlank()) {
            val query: PanacheQuery<Course> =
                find(
                    "LOWER(name) LIKE ?1",
                    "%${search.lowercase()}%",
                ).page(page - 1, limit)
            query.list()
        } else {
            findAll().page<Course>(page - 1, limit).list<Course>()
        }
    }
}
