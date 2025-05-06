package ro.sd.tennis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.sd.tennis.models.Tournament;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {}
