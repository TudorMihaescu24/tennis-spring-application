package ro.sd.tennis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.sd.tennis.models.Player;

import java.util.Optional;


public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> getPlayerById(long l);

}
