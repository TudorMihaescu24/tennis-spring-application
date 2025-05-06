package ro.sd.tennis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.sd.tennis.dto.PlayerDTO;
import ro.sd.tennis.dto.UserDTO;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.models.User;
import ro.sd.tennis.repository.PlayerRepository;
import ro.sd.tennis.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlayerService {

    @Autowired
    private final PlayerRepository playerRepository;

    @Autowired
    private JWTService jwtService;

    public boolean updateById(Long id, PlayerDTO userUpdateRequest) {
        Optional<Player> existingUser = playerRepository.findById(id);

        if (existingUser.isPresent()) {
            Player player = existingUser.get();

            player.setFirstName(userUpdateRequest.getFirstName());
            player.setLastName(userUpdateRequest.getLastName());
            player.setEmail(userUpdateRequest.getEmail());
            player.setGender(userUpdateRequest.getGender());
            player.setDateOfBirth(userUpdateRequest.getDateOfBirth());
            player.setCategory(userUpdateRequest.getCategory());
            playerRepository.save(player);
            return true;
        }
        return false;
    }

    public ResponseEntity<Player> getOneByToken(String id) {
        Optional<Player> player = playerRepository.getPlayerById(Long.parseLong(id));
        if(player.isPresent()) {
            return ResponseEntity.ok(player.get());
        }
        return ResponseEntity.notFound().build();
    }

}
