package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheQuery
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Student

@ApplicationScoped
class StudentRepository : PanacheRepositoryBase<Student, Long> {
    @Transactional
    fun deleteByIds(ids: List<Long>) = delete("id in ?1", ids)

    fun findByIds(ids: List<Long>): List<Student> {
        return find("id in ?1", ids).list()
    }

    fun findByEmail(email: String): Student? {
        return find("email", email).firstResult<Student>()
    }

    fun findStudents(
        page: Int,
        limit: Int,
        search: String?,
    ): List<Student> {
        return if (!search.isNullOrBlank()) {
            val query: PanacheQuery<Student> =
                find(
                    "LOWER(firstName) LIKE ?1 OR LOWER(lastName) LIKE ?1 OR LOWER(email) LIKE ?1",
                    "%${search.lowercase()}%",
                ).page(page - 1, limit)
            query.list()
        } else {
            findAll().page<Student>(page - 1, limit).list<Student>()
        }
    }
}
