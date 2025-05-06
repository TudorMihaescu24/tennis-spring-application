package ro.sd.tennis.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Player")
@Getter
@Setter
public class Player extends User {
    private String category;
}
