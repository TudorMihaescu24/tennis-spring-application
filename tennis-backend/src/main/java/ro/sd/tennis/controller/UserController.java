package ro.sd.tennis.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.sd.tennis.dto.UserDTO;
import ro.sd.tennis.service.JWTService;
import ro.sd.tennis.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserService userService;


    @GetMapping("/")
    public ResponseEntity<?> getUsers(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsers(
            @CookieValue(name = "jwt", required = false) String token,
            @PathVariable Long id,
            @RequestBody UserDTO userUpdateRequest) {

        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String role = jwtService.extractRole(token);

        System.out.println("ROLE: " + role);

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            boolean updated = userService.updateById(id, userUpdateRequest);
            if (!updated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok("User updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @CookieValue(name = "jwt", required = false) String token,
            @PathVariable Long id) {

        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            boolean deleted = userService.deleteById(id);

            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user: " + e.getMessage());


        }

    }

    @GetMapping("/one")
    public ResponseEntity<?> getUser(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String id = jwtService.extractId(token);
        return userService.getOneByToken(id);
    }
}
