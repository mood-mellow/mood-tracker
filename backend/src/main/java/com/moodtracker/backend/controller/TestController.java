package com.moodtracker.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("hello")
    public Map<String, Object> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello World!");
        return response;
    }

    @GetMapping("/hello/{name}")
    public ResponseEntity<Map<String, Object>> helloWithName(@PathVariable String name) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello " + name + "!");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

}
