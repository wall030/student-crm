package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import io.quarkus.panache.common.Sort
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.StudentEntity

@ApplicationScoped
class StudentRepository : PanacheRepositoryBase<StudentEntity, Long> {
    @Transactional
    fun deleteByIds(ids: List<Long>) = delete("id in ?1", ids)

    fun findByIds(ids: List<Long>): List<StudentEntity> = find("id in ?1", ids).list()

    fun findByEmail(email: String): StudentEntity? = find("email", email).firstResult<StudentEntity>()

    fun count(search: String): Long =
        count(
            "LOWER(firstName) LIKE ?1 OR LOWER(lastName) LIKE ?1 OR LOWER(email) LIKE ?1",
            "%${search.lowercase()}%",
        )

    fun findStudents(
        page: Int,
        limit: Int,
        search: String?,
        sortField: String,
        sortOrder: String,
    ): List<StudentEntity> {
        val order = if (sortOrder == "desc") Sort.Direction.Descending else Sort.Direction.Ascending
        val sort = Sort.by(sortField).direction(order)
        return if (!search.isNullOrBlank()) {
            find("LOWER(firstName) LIKE ?1 OR LOWER(lastName) LIKE ?1 OR LOWER(email) LIKE ?1", sort, "%${search.lowercase()}%")
                .page<StudentEntity>(page, limit)
                .list<StudentEntity>()
        } else {
            findAll(sort)
                .page<StudentEntity>(page, limit)
                .list<StudentEntity>()
        }
    }
}
