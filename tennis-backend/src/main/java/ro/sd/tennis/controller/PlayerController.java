package ro.sd.tennis.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.sd.tennis.dto.PlayerDTO;
import ro.sd.tennis.dto.UserDTO;
import ro.sd.tennis.service.JWTService;
import ro.sd.tennis.service.PlayerService;
import ro.sd.tennis.service.UserService;

@RestController
@RequestMapping("/api/player")
@RequiredArgsConstructor
public class PlayerController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private PlayerService playerService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(
            @CookieValue(name = "jwt", required = false) String token,
            @PathVariable Long id,
            @RequestBody PlayerDTO userUpdateRequest) {

        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String role = jwtService.extractRole(token);

        System.out.println("ROLE: " + role);

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            boolean updated = playerService.updateById(id, userUpdateRequest);
            if (!updated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
            }
            return ResponseEntity.ok("Player updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating player: " + e.getMessage());
        }
    }

    @GetMapping("/one")
    public ResponseEntity<?> getPlayer(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String id = jwtService.extractId(token);
        return playerService.getOneByToken(id);
    }

}
