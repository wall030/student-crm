package org.acme.repository

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
        return find("email",email).firstResult<Student>()
    }
}
