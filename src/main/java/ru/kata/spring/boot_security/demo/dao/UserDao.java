package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserDao {
    Optional<User> findUserByEmail(String email);
    void createUser(User user);
    void updateUser(User user);
    void deleteUser(long userId);
    User findUserById(long userId);
    List<User> getAllUsers();
}
