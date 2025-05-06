package ro.sd.tennis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.sd.tennis.models.Referee;
import java.util.Optional;

public interface RefereeRepository extends JpaRepository<Referee, Long> {
    Optional<Referee> getUserById(long l);

    Optional<Referee> getRefereesById(long l);
}
