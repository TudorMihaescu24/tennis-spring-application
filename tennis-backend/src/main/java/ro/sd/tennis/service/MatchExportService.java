package ro.sd.tennis.service;

import org.springframework.stereotype.Service;
import ro.sd.tennis.dto.MatchDTO;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

@Service
public class MatchExportService {
    private String escapeCSV(String field) {
        if (field.contains(",") || field.contains("\"")) {
            field = field.replace("\"", "\"\"");
            return "\"" + field + "\"";
        }
        return field;
    }

    public void saveMatchesAsCSV(List<MatchDTO> matches, String filePath) throws IOException {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath))) {
            writer.println("MatchId,Player1,Player2,MatchDate");

            for (MatchDTO match : matches) {
                String player1Name = match.getPlayer1().getFirstName() + " " + match.getPlayer1().getLastName();
                String player2Name = match.getPlayer2().getFirstName() + " " + match.getPlayer2().getLastName();

                writer.printf("%d,%s,%s,%s%n",
                        match.getId(),
                        escapeCSV(player1Name),
                        escapeCSV(player2Name),
                        match.getMatchDate().toString()
                );
            }
        }
    }


    public void saveMatchesAsText(List<MatchDTO> matches, String filePath) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            for (MatchDTO match : matches) {
                writer.write("Match ID: " + match.getId());
                writer.newLine();
                writer.write("Player 1: " + match.getPlayer1().getFirstName() + " " + match.getPlayer1().getLastName());
                writer.newLine();
                writer.write("Player 2: " + match.getPlayer2().getFirstName() + " " + match.getPlayer2().getLastName());
                writer.newLine();
                writer.write("Date: " + match.getMatchDate());
                writer.newLine();
                writer.write("----------------------------------------------------");
                writer.newLine();
            }
        }
    }
}
