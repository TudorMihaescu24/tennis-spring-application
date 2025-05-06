package ro.sd.tennis.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.sd.tennis.dto.TournamentDTO;
import ro.sd.tennis.dto.UserDTO;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.models.Tournament;
import ro.sd.tennis.repository.PlayerRepository;
import ro.sd.tennis.repository.RefereeRepository;
import ro.sd.tennis.service.JWTService;
import ro.sd.tennis.service.PlayerService;
import ro.sd.tennis.service.TournamentService;
import ro.sd.tennis.service.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {
    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private JWTService jwtService;
    @Autowired
    private PlayerService playerService;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private RefereeRepository refereeRepository;

    @GetMapping("/")
    public List<TournamentDTO> getAllTournaments() {
        return tournamentService.getAll();
    }

    @GetMapping("/player")
    public ResponseEntity<List<TournamentDTO>> getAllTournamentsByPlayer(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String id = jwtService.extractId(token);
        Optional<Player> optionalPlayer = playerRepository.getPlayerById(Long.parseLong(id));

        if (optionalPlayer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Player player = optionalPlayer.get();
        List<TournamentDTO> availableTournaments = tournamentService.getAvailableTournamentsForPlayer(player);
        return ResponseEntity.ok(availableTournaments);
    }

    @GetMapping("/player/joined")
    public ResponseEntity<List<TournamentDTO>> getAllTournamentsJoinedByPlayer(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String id = jwtService.extractId(token);
        Optional<Player> optionalPlayer = playerRepository.getPlayerById(Long.parseLong(id));

        if (optionalPlayer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Player player = optionalPlayer.get();
        List<TournamentDTO> availableTournaments = tournamentService.getAvailableJoinedForPlayer(player);
        return ResponseEntity.ok(availableTournaments);
    }

    @PostMapping("/player/join/{tournamentId}")
    public ResponseEntity<String> joinTournamentPlayer(
            @CookieValue(name = "jwt", required = false) String token,
            @PathVariable Long tournamentId
    ) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String id = jwtService.extractId(token);
        Optional<Player> player = playerRepository.getPlayerById(Long.parseLong(id));

        if (player.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Player not found");
        }

        tournamentService.addPlayerToTournament(tournamentId, player.get());

        return ResponseEntity.ok("Player joined successfully");
    }

    @GetMapping("/referee")
    public ResponseEntity<List<TournamentDTO>> getAllTournamentsByReferee(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String id = jwtService.extractId(token);
        Optional<Referee> optionalReferee = refereeRepository.getRefereesById(Long.parseLong(id));

        if (optionalReferee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Referee referee = optionalReferee.get();
        List<TournamentDTO> availableTournaments = tournamentService.getAvailableTournamentsForReferee(referee);
        return ResponseEntity.ok(availableTournaments);
    }

    @GetMapping("/referee/joined")
    public ResponseEntity<List<TournamentDTO>> getAllTournamentsJoinedByReferee(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String id = jwtService.extractId(token);
        Optional<Referee> optionalReferee = refereeRepository.getRefereesById(Long.parseLong(id));

        if (optionalReferee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Referee referee = optionalReferee.get();
        List<TournamentDTO> availableTournaments = tournamentService.getAvailableJoinedForReferee(referee);
        return ResponseEntity.ok(availableTournaments);
    }

    @PostMapping("/referee/join/{tournamentId}")
    public ResponseEntity<String> joinTournamentReferee(
            @CookieValue(name = "jwt", required = false) String token,
            @PathVariable Long tournamentId
    ) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String id = jwtService.extractId(token);
        Optional<Referee> referee = refereeRepository.getRefereesById(Long.parseLong(id));

        if (referee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Referee not found");
        }

        tournamentService.addRefereeToTournament(tournamentId, referee.get());

        return ResponseEntity.ok("Player joined successfully");
    }


    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        return tournamentService.getTournamentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tournament> createTournament(@RequestBody TournamentDTO dto) {
        try {
            Tournament tournament = tournamentService.createTournament(dto);
            return ResponseEntity.ok(tournament);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.noContent().build();
    }
}
