package com.whispr.server.repository;

import com.whispr.server.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByUsername(String username);
    AppUser findById(long id);
    List<AppUser> findAll();
}
