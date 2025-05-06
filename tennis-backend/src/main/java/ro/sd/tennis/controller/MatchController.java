package ro.sd.tennis.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.sd.tennis.dto.MatchDTO;
import ro.sd.tennis.dto.ScoreDTO;
import ro.sd.tennis.dto.TournamentDTO;
import ro.sd.tennis.models.Match;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.repository.PlayerRepository;
import ro.sd.tennis.repository.RefereeRepository;
import ro.sd.tennis.service.JWTService;
import ro.sd.tennis.service.MatchExportService;
import ro.sd.tennis.service.MatchService;
import ro.sd.tennis.service.PlayerService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/match")
public class MatchController {

    @Autowired
    private JWTService jwtService;

    @Autowired
    private MatchService matchService;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RefereeRepository refereeRepository;

    @Autowired
    private MatchExportService matchExportService;

    @GetMapping("/")
    public ResponseEntity<?> getAllMatches(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role) && !"REFEREE".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        List<MatchDTO> matches = matchService.getAllMatches();
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/player")
    public ResponseEntity<List<MatchDTO>> getSchedulePlayer(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String id = jwtService.extractId(token);
        Optional<Player> optionalPlayer = playerRepository.getPlayerById(Long.parseLong(id));

        if (optionalPlayer.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Player player = optionalPlayer.get();
        List<MatchDTO> availableTournaments = matchService.getAllMatches(player);
        return ResponseEntity.ok(availableTournaments);
    }

    @GetMapping("/referee")
    public ResponseEntity<List<MatchDTO>> getScheduleReferee(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String id = jwtService.extractId(token);
        Optional<Referee> optionalReferee = refereeRepository.getRefereesById(Long.parseLong(id));

        if (optionalReferee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Referee referee = optionalReferee.get();
        List<MatchDTO> availableTournaments = matchService.getAllMatches(referee);
        return ResponseEntity.ok(availableTournaments);
    }

    @PutMapping("/score/{id}")
    public ResponseEntity<?> updateMatchScore(
            @PathVariable Long id,
            @RequestBody ScoreDTO scoreDTO
    ) {
        Match updatedMatch = matchService.updateMatchScore(
                id,
                scoreDTO.getScorePlayer1(),
                scoreDTO.getScorePlayer2()
        );

        return ResponseEntity.ok(updatedMatch);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<MatchDTO>> getMatchesByTournament(@PathVariable Long id) {
        List<MatchDTO> dtos = matchService.getMatchesByTournament(id);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> downloadMatchesFile(
            @RequestParam("type") String type,
            @RequestParam(value = "gender", defaultValue = "ALL") String gender,
            @RequestParam(value = "category", defaultValue = "ALL") String category,
            @CookieValue(name = "jwt", required = false) String token
    ) throws IOException {
        if (token == null || !jwtService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String role = jwtService.extractRole(token);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<MatchDTO> matches = matchService.getAllMatchesFiltered(gender, category);

        File tempFile = File.createTempFile("matches_", "." + type.toLowerCase());
        String filePath = tempFile.getAbsolutePath();


        if ("csv".equalsIgnoreCase(type)) {
            matchExportService.saveMatchesAsCSV(matches, filePath);
        } else if ("txt".equalsIgnoreCase(type)) {
            matchExportService.saveMatchesAsText(matches, filePath);
        } else {
            return ResponseEntity.badRequest().body(null);
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(tempFile));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=matches." + type)
                .contentType("csv".equalsIgnoreCase(type)
                        ? MediaType.parseMediaType("text/csv")
                        : MediaType.TEXT_PLAIN)
                .contentLength(tempFile.length())
                .body(resource);
    }

}
