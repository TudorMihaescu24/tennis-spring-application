package ro.sd.tennis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "ro.sd.tennis.models")
public class TennisBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TennisBackendApplication.class, args);
    }

}
