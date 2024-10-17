package org.acme.repository

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase
import jakarta.enterprise.context.ApplicationScoped
import jakarta.transaction.Transactional
import org.acme.model.Course

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
}
