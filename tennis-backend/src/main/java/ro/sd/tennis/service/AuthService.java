package ro.sd.tennis.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ro.sd.tennis.dto.LoginDTO;
import ro.sd.tennis.dto.PlayerDTO;
import ro.sd.tennis.dto.RefereeDTO;
import ro.sd.tennis.enums.Role;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.models.User;
import ro.sd.tennis.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private JWTService jwtService;

    public void registerPlayer(PlayerDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already in use!");
        }

        try {
            Player player = new Player();
            player.setEmail(dto.getEmail());
            player.setPassword(passwordEncoder.encode(dto.getPassword()));
            player.setFirstName(dto.getFirstName());
            player.setLastName(dto.getLastName());
            player.setGender(dto.getGender());
            player.setDateOfBirth(dto.getDateOfBirth());
            player.setRole(Role.PLAYER);
            player.setCategory(dto.getCategory());

            userRepository.save(player);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error registering player");
        }
    }

    public void registerReferee(RefereeDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already in use!");
        }
        try {
            Referee referee = new Referee();
            referee.setEmail(dto.getEmail());
            referee.setPassword(passwordEncoder.encode(dto.getPassword()));
            referee.setFirstName(dto.getFirstName());
            referee.setLastName(dto.getLastName());
            referee.setGender(dto.getGender());
            referee.setDateOfBirth(dto.getDateOfBirth());
            referee.setRole(Role.REFEREE);
            referee.setYearsOfExperience(dto.getYearsOfExperience());

            userRepository.save(referee);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error registering referee");
        }
    }

    public String login(LoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
    }

    public ResponseEntity<?> getCurrentRole(HttpServletRequest request) {
        String token = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String role = jwtService.extractRole(token);

        Map<String, Object> response = new HashMap<>();
        response.put("role", role);

        return ResponseEntity.ok(response);
    }

}
