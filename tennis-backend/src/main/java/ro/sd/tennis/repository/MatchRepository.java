package ro.sd.tennis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.sd.tennis.models.Match;
import ro.sd.tennis.models.Tournament;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByTournament(Tournament tournament);

    List<Match> findByTournament_Id(Long tournamentId);
}
