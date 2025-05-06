package ro.sd.tennis.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.sd.tennis.dto.PlayerDTO;
import ro.sd.tennis.dto.RefereeDTO;
import ro.sd.tennis.service.JWTService;
import ro.sd.tennis.service.PlayerService;
import ro.sd.tennis.service.RefereeService;

@RestController
@RequestMapping("/api/referee")
@RequiredArgsConstructor
public class RefereeController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private RefereeService refereeService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReferee(
            @CookieValue(name = "jwt", required = false) String token,
            @PathVariable Long id,
            @RequestBody RefereeDTO userUpdateRequest) {

        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String role = jwtService.extractRole(token);

        System.out.println("ROLE: " + role);

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        try {
            boolean updated = refereeService.updateById(id, userUpdateRequest);
            if (!updated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Referee not found");
            }
            return ResponseEntity.ok("Referee updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating referee: " + e.getMessage());
        }
    }

    @GetMapping("/one")
    public ResponseEntity<?> getReferee(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        String id = jwtService.extractId(token);
        return refereeService.getOneByToken(id);
    }

}
