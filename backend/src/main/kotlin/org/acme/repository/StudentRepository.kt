package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheRepository
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Student

@ApplicationScoped
class StudentRepository: PanacheRepositoryBase<Student, Long> {

    @Transactional
    fun deleteByIds(ids: List<Long>) = delete("id in (?1)", ids)

}