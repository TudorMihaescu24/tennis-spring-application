package ro.sd.tennis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ro.sd.tennis.dto.PlayerDTO;
import ro.sd.tennis.dto.RefereeDTO;
import ro.sd.tennis.models.Player;
import ro.sd.tennis.models.Referee;
import ro.sd.tennis.models.User;
import ro.sd.tennis.repository.PlayerRepository;
import ro.sd.tennis.repository.RefereeRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefereeService {

    @Autowired
    private RefereeRepository refereeRepository;
    @Autowired
    private PlayerRepository playerRepository;

    public boolean updateById(Long id, RefereeDTO refereeDTO) {
        Optional<Referee> existingReferee = refereeRepository.findById(id);

        if (existingReferee.isPresent()) {
            Referee referee = existingReferee.get();

            referee.setFirstName(refereeDTO.getFirstName());
            referee.setLastName(refereeDTO.getLastName());
            referee.setDateOfBirth(refereeDTO.getDateOfBirth());
            referee.setGender(refereeDTO.getGender());
            referee.setYearsOfExperience(refereeDTO.getYearsOfExperience());

            refereeRepository.save(referee);
            return true;
        }

        return false;
    }

    public ResponseEntity<Referee> getOneByToken(String id) {
        Optional<Referee> referee = refereeRepository.getRefereesById(Long.parseLong(id));
        if(referee.isPresent()) {
            return ResponseEntity.ok(referee.get());
        }
        return ResponseEntity.notFound().build();
    }
}
