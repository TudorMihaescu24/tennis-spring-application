package ro.sd.tennis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.sd.tennis.dto.MatchDTO;
import ro.sd.tennis.dto.TournamentDTO;
import ro.sd.tennis.models.Match;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.models.Tournament;
import ro.sd.tennis.repository.MatchRepository;
import ro.sd.tennis.repository.TournamentRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    @Autowired
    private final TournamentRepository tournamentRepository;

    @Autowired
    private final MatchRepository matchRepository;

    @Autowired
    private JWTService jwtService;

    public void generateEliminationMatchesForTournament(Tournament tournament) {
        List<Player> players = new ArrayList<>(tournament.getPlayers());
        Referee referee = tournament.getReferee();

        if (players.size() != 4 || referee == null) {
            throw new RuntimeException("Exactly 4 players and at least 2 referees required");
        }

        Collections.shuffle(players);

        Match semiFinal1 = new Match();
        semiFinal1.setTournament(tournament);
        semiFinal1.setPlayer1(players.get(0));
        semiFinal1.setPlayer2(players.get(1));
        semiFinal1.setReferee(referee);
        semiFinal1.setScorePlayer1(0);
        semiFinal1.setScorePlayer2(0);
        semiFinal1.setMatchDate(tournament.getDate());

        Match semiFinal2 = new Match();
        semiFinal2.setTournament(tournament);
        semiFinal2.setPlayer1(players.get(2));
        semiFinal2.setPlayer2(players.get(3));
        semiFinal2.setReferee(referee);
        semiFinal2.setScorePlayer1(0);
        semiFinal2.setScorePlayer2(0);
        semiFinal2.setMatchDate(tournament.getDate());

        Match finalMatch = new Match();
        finalMatch.setTournament(tournament);
        finalMatch.setPlayer1(null);
        finalMatch.setPlayer2(null);
        finalMatch.setReferee(referee);
        finalMatch.setScorePlayer1(0);
        finalMatch.setScorePlayer2(0);
        finalMatch.setMatchDate(tournament.getDate().plusDays(1));

        matchRepository.save(semiFinal1);
        matchRepository.save(semiFinal2);
        matchRepository.save(finalMatch);
    }

    public List<MatchDTO> getAllMatches(Player player) {
        List<Match> allMatches = matchRepository.findAll();

        return allMatches.stream()
                .filter(m -> m.getPlayer1().equals(player) || m.getPlayer2().equals(player))
                .map(m -> {
                    MatchDTO dto = new MatchDTO();
                    dto.setId(m.getId());
                    dto.setMatchDate(m.getMatchDate());
                    dto.setTournamentName(m.getTournament().getName());
                    dto.setPlayer1(m.getPlayer1());
                    dto.setPlayer2(m.getPlayer2());
                    dto.setReferee(m.getReferee());
                    dto.setScorePlayer1(m.getScorePlayer1());
                    dto.setScorePlayer2(m.getScorePlayer2());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getAllMatches(Referee referee) {
        List<Match> allMatches = matchRepository.findAll();

        return allMatches.stream()
                .filter(m -> m.getReferee().equals(referee))
                .map(m -> {
                    MatchDTO dto = new MatchDTO();
                    dto.setId(m.getId());
                    dto.setMatchDate(m.getMatchDate());
                    dto.setTournamentName(m.getTournament().getName());
                    dto.setPlayer1(m.getPlayer1());
                    dto.setPlayer2(m.getPlayer2());
                    dto.setReferee(m.getReferee());
                    dto.setScorePlayer1(m.getScorePlayer1());
                    dto.setScorePlayer2(m.getScorePlayer2());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void updateFinalMatch(Tournament tournament) {
        List<Match> matches = matchRepository.findByTournament(tournament);

        List<Match> semiFinals = matches.stream()
                .filter(m -> m.getMatchDate().equals(tournament.getDate()))
                .collect(Collectors.toList());

        if (semiFinals.size() != 2) {
            throw new RuntimeException("Two semifinal matches are required.");
        }

        Player winner1 = getMatchWinner(semiFinals.get(0));
        Player winner2 = getMatchWinner(semiFinals.get(1));

        Optional<Match> finalMatchOptional = matches.stream()
                .filter(m -> m.getMatchDate().equals(tournament.getDate().plusDays(1)))
                .findFirst();

        if (finalMatchOptional.isEmpty()) {
            throw new RuntimeException("Final match not found.");
        }

        Match finalMatch = finalMatchOptional.get();
        finalMatch.setPlayer1(winner1);
        finalMatch.setPlayer2(winner2);

        matchRepository.save(finalMatch);
    }

    private Player getMatchWinner(Match match) {
        if (match.getScorePlayer1() > match.getScorePlayer2()) {
            return match.getPlayer1();
        } else if (match.getScorePlayer2() > match.getScorePlayer1()) {
            return match.getPlayer2();
        } else {
            throw new RuntimeException("Match resulted in a draw. Cannot determine winner.");
        }
    }

    public Match updateMatchScore(Long matchId, int scorePlayer1, int scorePlayer2) {
        Optional<Match> matchOptional = matchRepository.findById(matchId);

        if (matchOptional.isEmpty()) {
            throw new RuntimeException("Match not found with id: " + matchId);
        }

        Match match = matchOptional.get();
        match.setScorePlayer1(scorePlayer1);
        match.setScorePlayer2(scorePlayer2);
        match = matchRepository.save(match);

        Tournament tournament = match.getTournament();

        List<Match> matches = matchRepository.findByTournament(tournament);

        List<Match> semiFinals = matches.stream()
                .filter(m -> m.getMatchDate().equals(tournament.getDate()))
                .collect(Collectors.toList());

        if (semiFinals.size() == 2) {
            boolean bothPlayed = semiFinals.stream()
                    .allMatch(m -> m.getScorePlayer1() != null && m.getScorePlayer2() != null);

            if (bothPlayed) {
                updateFinalMatch(tournament);
            }
        }

        return match;
    }

    public List<MatchDTO> getMatchesByTournament(Long tournamentId) {
        Optional<Tournament> tournamentOptional = tournamentRepository.findById(tournamentId);

        if (tournamentOptional.isEmpty()) {
            throw new RuntimeException("Tournament not found with id: " + tournamentId);
        }

        List<Match> matches = matchRepository.findByTournament_Id(tournamentId);

        return matches.stream().map(match -> {
            MatchDTO dto = new MatchDTO();
            dto.setId(match.getId());
            dto.setMatchDate(match.getMatchDate());
            dto.setTournamentName(match.getTournament().getName());
            dto.setPlayer1(match.getPlayer1());
            dto.setPlayer2(match.getPlayer2());
            dto.setReferee(match.getReferee());
            dto.setScorePlayer1(match.getScorePlayer1());
            dto.setScorePlayer2(match.getScorePlayer2());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<MatchDTO> getAllMatches()
    {
        List<Match> matches = matchRepository.findAll();

        return matches.stream().map(match -> {
            MatchDTO dto = new MatchDTO();
            dto.setId(match.getId());
            dto.setMatchDate(match.getMatchDate());
            dto.setTournamentName(match.getTournament().getName());
            dto.setPlayer1(match.getPlayer1());
            dto.setPlayer2(match.getPlayer2());
            dto.setReferee(match.getReferee());
            dto.setScorePlayer1(match.getScorePlayer1());
            dto.setScorePlayer2(match.getScorePlayer2());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<MatchDTO> getAllMatchesFiltered(String gender, String category) {
        List<Match> matches = matchRepository.findAll();

        return matches.stream()
                .filter(m -> "ALL".equalsIgnoreCase(gender) ||
                        m.getPlayer1().getGender().equalsIgnoreCase(gender) ||
                        m.getPlayer2().getGender().equalsIgnoreCase(gender))
                .filter(m -> "ALL".equalsIgnoreCase(category) ||
                        m.getPlayer1().getCategory().equalsIgnoreCase(category) ||
                        m.getPlayer2().getCategory().equalsIgnoreCase(category))
                .map(match -> {
                    MatchDTO dto = new MatchDTO();
                    dto.setId(match.getId());
                    dto.setMatchDate(match.getMatchDate());
                    dto.setTournamentName(match.getTournament().getName());
                    dto.setPlayer1(match.getPlayer1());
                    dto.setPlayer2(match.getPlayer2());
                    dto.setReferee(match.getReferee());
                    dto.setScorePlayer1(match.getScorePlayer1());
                    dto.setScorePlayer2(match.getScorePlayer2());
                    return dto;
                }).collect(Collectors.toList());
    }


}
