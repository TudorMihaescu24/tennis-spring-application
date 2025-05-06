package ro.sd.tennis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.sd.tennis.dto.TournamentDTO;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.models.Tournament;
import ro.sd.tennis.repository.TournamentRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private MatchService matchService;

    public Optional<Tournament> getTournamentById(Long id) {
        return tournamentRepository.findById(id);
    }

    public Tournament createTournament(TournamentDTO dto) {
        Tournament tournament = new Tournament();
        tournament.setId(dto.getId());
        tournament.setName(dto.getName());
        tournament.setDate(dto.getDate());
        tournament.setCategory(dto.getCategory());
        tournament.setGender(dto.getGender());
        return tournamentRepository.save(tournament);
    }

    public void addPlayerToTournament(Long tournamentId, Player player) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (tournament.getPlayers().contains(player)) {
            throw new RuntimeException("Player already joined this tournament");
        }

        tournament.getPlayers().add(player);
        tournamentRepository.save(tournament);

        if (tournament.getReferee() != null && tournament.getPlayers().size() == 4) {
            matchService.generateEliminationMatchesForTournament(tournament);
        }
    }

    public void addRefereeToTournament(Long tournamentId, Referee referee) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (referee.equals(tournament.getReferee())) {
            throw new RuntimeException("Referee already joined this tournament");
        }

        tournament.setReferee(referee);
        tournamentRepository.save(tournament);

        if (tournament.getReferee() != null && tournament.getPlayers().size() == 4) {
            matchService.generateEliminationMatchesForTournament(tournament);
        }
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }

    public List<TournamentDTO> getAll() {
        return tournamentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TournamentDTO> getAvailableTournamentsForPlayer(Player player) {
        return tournamentRepository.findAll().stream()
                .filter(t -> !t.getPlayers().contains(player))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TournamentDTO> getAvailableTournamentsForReferee(Referee referee) {
        return tournamentRepository.findAll().stream()
                .filter(t -> t.getReferee() == null || !t.getReferee().equals(referee))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TournamentDTO> getAvailableJoinedForPlayer(Player player) {
        return tournamentRepository.findAll().stream()
                .filter(t -> t.getPlayers().contains(player))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TournamentDTO> getAvailableJoinedForReferee(Referee referee) {
        return tournamentRepository.findAll().stream()
                .filter(t -> referee.equals(t.getReferee()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TournamentDTO convertToDTO(Tournament t) {
        TournamentDTO dto = new TournamentDTO();
        dto.setId(t.getId());
        dto.setName(t.getName());
        dto.setDate(t.getDate());
        dto.setCategory(t.getCategory());
        dto.setGender(t.getGender());

        List<String> playerNames = t.getPlayers().stream()
                .map(p -> p.getFirstName() + " " + p.getLastName())
                .collect(Collectors.toList());
        dto.setPlayerNames(playerNames);

        System.out.println("HIT");

        if (t.getReferee() != null) {
            dto.setRefereeName(t.getReferee().getFirstName() + " " + t.getReferee().getLastName());
        }

        return dto;
    }
}
