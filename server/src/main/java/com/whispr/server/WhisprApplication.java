package com.whispr.server;

import com.whispr.server.model.AppUser;
import com.whispr.server.repository.ChatRoomRepository;
import com.whispr.server.repository.UserRepository;
import com.whispr.server.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class WhisprApplication {


    public static void main(String[] args) {
        SpringApplication.run(WhisprApplication.class, args);
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


}
