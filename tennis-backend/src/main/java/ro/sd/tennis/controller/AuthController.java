package ro.sd.tennis.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.sd.tennis.dto.LoginDTO;
import ro.sd.tennis.dto.PlayerDTO;
import ro.sd.tennis.dto.RefereeDTO;
import ro.sd.tennis.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private  AuthService authService;

    @PostMapping("/register/player")
    public ResponseEntity<String> registerPlayer(@RequestBody PlayerDTO dto) {
        authService.registerPlayer(dto);
        return ResponseEntity.ok("Player registered successfully");
    }

    @PostMapping("/register/referee")
    public ResponseEntity<String> registerReferee(@RequestBody RefereeDTO dto) {
        authService.registerReferee(dto);
        return ResponseEntity.ok("Referee registered successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // immediately expires
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        String token = authService.login(loginDTO);

        if (token == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(3600) // 1 hour expiry
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Login successful");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentRole(HttpServletRequest request) {
        return authService.getCurrentRole(request);
    }

}
