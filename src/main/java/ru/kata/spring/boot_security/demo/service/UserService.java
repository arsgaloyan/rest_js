package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.configs.WebSecurityConfig;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.model.User;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserDao userDao;
    private final RoleService roleService;
    private final WebSecurityConfig webSecurityConfig;

    @Autowired
    public UserService(UserDao userDao, WebSecurityConfig webSecurityConfig, RoleService roleService) {
        this.userDao = userDao;
        this.webSecurityConfig = webSecurityConfig;
        this.roleService = roleService;
    }
    @Transactional(readOnly = true)
    public Optional<User> findUserByEmail(String email) {
        return userDao.findUserByEmail(email);
    }

    @Transactional
    public boolean createUser(User user) {
        if (userDao.findUserByEmail(user.getEmail()).isEmpty()) {
            user.setRoles(roleService.getOriginalRoles(user.getRoles()));
            user.setActive(true);
            user.setPassword(webSecurityConfig.passwordEncoder().encode(user.getPassword()));
            userDao.createUser(user);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteUser(long id) {
        User user = userDao.findUserById(id);
        if (user != null) {
            userDao.deleteUser(id);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public List<User> listUsersCount(int count) {
        List<User> listUsers = getAllUsers();
        if (count >= 15) {
            return listUsers;
        } else {
            return listUsers.subList(0, Math.min(count, listUsers.size()));
        }
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }
    @Transactional(readOnly = true)
    public User getUser(long id) {
        return userDao.findUserById(id);
    }

    @Transactional
    public void updateUser(Long id, User user, String role) {
        User saveUser = userDao.findUserById(id);
        if (saveUser != null) {
            saveUser.setEmail(user.getEmail());
            saveUser.setAge(user.getAge());
            saveUser.setActive(user.isActive());
            saveUser.setFirstName(user.getFirstName());
            saveUser.setLastName(user.getLastName());
            saveUser.clearRoles();
            saveUser.addRole(role);
            saveUser.setRoles(roleService.getOriginalRoles(saveUser.getRoles()));
            if (!saveUser.getPassword().equals(user.getPassword())) {
                saveUser.setPassword(webSecurityConfig.passwordEncoder().encode(user.getPassword()));

            }
            userDao.updateUser(saveUser);
        }
    }
}
