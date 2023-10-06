package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dao.RoleDao;
import ru.kata.spring.boot_security.demo.model.Role;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.Set;

@Service
public class RoleService {
    private final RoleDao roleDao;

    @Autowired
    public RoleService(RoleDao roleDao) {
        this.roleDao = roleDao;
    }
    @Transactional
    public void addRole(Role role) {
        roleDao.save(role);
    }

    @Transactional
    public Set<Role> getOriginalRoles(Set<Role> rolesIn) {
        Set<Role> roles = new HashSet<>();
        for (Role i : rolesIn) {
            Role role = roleDao.findRoleByName(i.getName());
            if (role == null) {
                roleDao.save(i);
                roles.add(i);
            } else {
                roles.add(role);
            }
        }
        return roles;
    }
}
