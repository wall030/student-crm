package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheQuery
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import io.quarkus.panache.common.Sort
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
        sortField: String,
        sortOrder: String
    ): List<CourseEntity> {
        val order = if (sortOrder == "desc") Sort.Direction.Descending else Sort.Direction.Ascending
        val comparator: Comparator<CourseEntity> = when (sortField.lowercase()) {
            "name" -> compareBy<CourseEntity> { it.name.lowercase() }
            else -> throw IllegalArgumentException("Invalid sort field: $sortField")
        }.let { if (order == Sort.Direction.Descending) it.reversed() else it }
        return if (!search.isNullOrBlank()) {
            find(
                "LOWER(name) LIKE ?1",
                "%${search.lowercase()}%"
            )
                .page<CourseEntity>(page - 1, limit)
                .list<CourseEntity>().sortedWith(comparator)
        } else {
            findAll()
                .page<CourseEntity>(page - 1, limit)
                .list<CourseEntity>()
                .sortedWith(comparator)
        }
    }
}
