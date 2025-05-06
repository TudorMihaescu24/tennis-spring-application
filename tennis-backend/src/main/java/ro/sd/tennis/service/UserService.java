package ro.sd.tennis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.sd.tennis.dto.UserDTO;
import ro.sd.tennis.models.User;
import ro.sd.tennis.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    public boolean updateById(Long id, UserDTO userUpdateRequest) {
        Optional<User> existingUser = userRepository.findById(id);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            user.setFirstName(userUpdateRequest.getFirstName());
            user.setLastName(userUpdateRequest.getLastName());
            user.setEmail(userUpdateRequest.getEmail());
            user.setGender(userUpdateRequest.getGender());
            user.setDateOfBirth(userUpdateRequest.getDateOfBirth());

            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean deleteById(Long id) {
        Optional<User> existingUser = userRepository.findById(id);

        if (existingUser.isPresent()) {
            try {
                userRepository.delete(existingUser.get());
                return true;
            } catch (Exception e) {
                System.err.println("Error deleting user: " + e.getMessage());
                return false;
            }
        }

        return false;
    }

    public ResponseEntity<User> getOneByToken(String id) {
        Optional<User> user = userRepository.getUserById(Long.parseLong(id));
        if(user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
}
