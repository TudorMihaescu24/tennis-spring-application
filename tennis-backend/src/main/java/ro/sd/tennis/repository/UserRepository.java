package ro.sd.tennis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.sd.tennis.models.User;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    public Optional<User> findByEmail(String email);

    Optional<User> getUserById(long l);
}
