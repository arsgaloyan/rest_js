package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class RoleDaoImpl implements RoleDao {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Role findRoleByName(String name) {
        String jpql = "SELECT r FROM Role r WHERE r.name = :name";
        return entityManager.createQuery(jpql, Role.class)
                .setParameter("name", name)
                .getSingleResult();
    }


    @Override
    public void save(Role role) {
        entityManager.persist(role);
    }
}
