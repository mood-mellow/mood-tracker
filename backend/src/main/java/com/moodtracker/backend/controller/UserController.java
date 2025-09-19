package com.moodtracker.backend.controller;

import com.moodtracker.backend.dto.StrangerDTO;
import com.moodtracker.backend.model.User;
import com.moodtracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userRepository.findById(id).orElse(null);
    }

    @GetMapping("/{clientUserId}/search/{searchedUsername}")
    public List<StrangerDTO> getStrangers(@PathVariable String clientUserId, @PathVariable String searchedUsername) {
        Optional<User> clientUser = userRepository.findById(clientUserId);
        List<User> users = userRepository.findByUsernameContainingIgnoreCase(searchedUsername);
        List<StrangerDTO> strangers = users.stream()
                .filter(user -> user != clientUser.get())
                .map(user -> new StrangerDTO(user.getId(), user.getUsername()))
                .collect(Collectors.toList());
        return strangers;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            return userRepository.save(user);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }
}
