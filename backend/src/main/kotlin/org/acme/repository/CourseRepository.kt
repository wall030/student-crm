package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.CourseEntity
import org.acme.model.StudentEntity

@ApplicationScoped
class CourseRepository : PanacheRepositoryBase<CourseEntity, Long> {
    @Transactional
    fun deleteByIds(ids: List<Long>) = delete("id in ?1", ids)

    fun findByIds(ids: List<Long>): List<CourseEntity> = find("id in ?1", ids).list()

    fun findByName(name: String): CourseEntity? = find("name", name).firstResult<CourseEntity>()

    fun count(search: String): Long = count(
        "LOWER(name) LIKE ?1",
        "%${search.lowercase()}%"
    )

    fun findCourses(
        page: Int,
        limit: Int,
        search: String?,
        sortField: String,
        sortOrder: String,
    ): List<CourseEntity> {
        val order = if (sortOrder == "desc") Sort.Direction.Descending else Sort.Direction.Ascending
        val sort = Sort.by(sortField).direction(order)
        return if (!search.isNullOrBlank()) {
            find("LOWER(name) LIKE ?1", sort,"%${search.lowercase()}%")
                .page<CourseEntity>(page, limit)
                .list<CourseEntity>()
        } else {
            findAll(sort)
                .page<CourseEntity>(page, limit)
                .list<CourseEntity>()
        }
    }
}
