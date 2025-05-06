package ro.sd.tennis.dto;

import lombok.*;

@Getter
@Setter
public class RefereeDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String gender;
    private String dateOfBirth;
    private Integer yearsOfExperience;
}