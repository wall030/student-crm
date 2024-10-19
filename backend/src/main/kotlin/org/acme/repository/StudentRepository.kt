package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheQuery
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.StudentEntity

@ApplicationScoped
class StudentRepository : PanacheRepositoryBase<StudentEntity, Long> {
    @Transactional
    fun deleteByIds(ids: List<Long>) = delete("id in ?1", ids)

    fun findByIds(ids: List<Long>): List<StudentEntity> = find("id in ?1", ids).list()

    fun findByEmail(email: String): StudentEntity? = find("email", email).firstResult<StudentEntity>()

    fun findStudents(
        page: Int,
        limit: Int,
        search: String?,
    ): List<StudentEntity> =
        if (!search.isNullOrBlank()) {
            val query: PanacheQuery<StudentEntity> =
                find(
                    "LOWER(firstName) LIKE ?1 OR LOWER(lastName) LIKE ?1 OR LOWER(email) LIKE ?1",
                    "%${search.lowercase()}%",
                ).page(page - 1, limit)
            query.list()
        } else {
            findAll().page<StudentEntity>(page - 1, limit).list<StudentEntity>()
        }
}
