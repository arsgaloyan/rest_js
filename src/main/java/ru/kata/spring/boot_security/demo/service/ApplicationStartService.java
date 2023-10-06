package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.StoredProcedureQuery;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationStartService {
    private final EntityManager entityManager;

    @Autowired
    public ApplicationStartService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @PostConstruct
    @Transactional
    public void initializeApplication() {
        StoredProcedureQuery storedProcedure = entityManager.createStoredProcedureQuery("CreateInitialUsersIfTableEmpty");
        storedProcedure.execute();
    }
}
