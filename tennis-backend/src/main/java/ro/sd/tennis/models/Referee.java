package ro.sd.tennis.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Referee")
@Getter
@Setter
public class Referee extends User {
    private Integer yearsOfExperience;
}
