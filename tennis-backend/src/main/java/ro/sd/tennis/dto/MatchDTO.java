package ro.sd.tennis.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.models.Tournament;

import java.time.LocalDate;

@Getter
@Setter
public class MatchDTO {
    private Long id;
    private String tournamentName;
    private Player player1;
    private Player player2;
    private Referee referee;
    private Integer scorePlayer1;
    private Integer scorePlayer2;
    private LocalDate matchDate;
}
