package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class AdminRestController {

    private final UserService userService;

    @Autowired
    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @CrossOrigin
    @GetMapping()
    public ResponseEntity<List<User>> getUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }
    @CrossOrigin
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUser(id),HttpStatus.OK);
    }
    @CrossOrigin
    @GetMapping("/me")
    public ResponseEntity<Optional<User>> getMe(Authentication authentication) {
        if (authentication != null) {
            return new ResponseEntity<>(userService.findUserByEmail(authentication.getName()),HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody User user, @RequestParam String role) {
        user.addRole(role);
        userService.createUser(user);
        return new ResponseEntity<>(userService.findUserByEmail(user.getEmail()).get(),HttpStatus.OK);
    }

    @CrossOrigin
    @PutMapping("/edit/{id}")
    public ResponseEntity<User> editUser(@PathVariable Long id, @RequestBody User user, @RequestParam String role) {
        userService.updateUser(id, user, role);
        return new ResponseEntity<>(userService.getUser(id),HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(id.toString());
    }
}
