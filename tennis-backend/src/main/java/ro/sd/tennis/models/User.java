package ro.sd.tennis.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ro.sd.tennis.enums.Role;

@Entity
@Table(name = "Users")
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String gender;
    private String dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Role role;
}
