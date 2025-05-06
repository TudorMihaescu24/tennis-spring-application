package ro.sd.tennis.dto;

import lombok.Getter;
import lombok.Setter;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TournamentDTO {
    private Long id;
    private String name;
    private LocalDate date;
    private String category;
    private String gender;
    private List<String> playerNames;
    private String refereeName;
}