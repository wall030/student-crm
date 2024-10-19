package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheQuery
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.CourseEntity

@ApplicationScoped
class CourseRepository : PanacheRepositoryBase<CourseEntity, Long> {
    @Transactional
    fun deleteByIds(ids: List<Long>) = delete("id in ?1", ids)

    fun findByIds(ids: List<Long>): List<CourseEntity> = find("id in ?1", ids).list()

    fun findByName(name: String): CourseEntity? = find("name", name).firstResult<CourseEntity>()

    fun findCourses(
        page: Int,
        limit: Int,
        search: String?,
    ): List<CourseEntity> =
        if (!search.isNullOrBlank()) {
            val query: PanacheQuery<CourseEntity> =
                find(
                    "LOWER(name) LIKE ?1",
                    "%${search.lowercase()}%",
                ).page(page - 1, limit)
            query.list()
        } else {
            findAll().page<CourseEntity>(page - 1, limit).list<CourseEntity>()
        }
}
