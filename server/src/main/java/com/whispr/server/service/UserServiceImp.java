package com.whispr.server.service;

import com.whispr.server.entity.AppUser;
import com.whispr.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImp implements UserService, UserDetailsService {
    private final UserRepository userRepo;
    private final PasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> userOptional = userRepo.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("username not found");
        }
        AppUser user = userOptional.get();
        Collection<SimpleGrantedAuthority> roles = new ArrayList<>();
        user.getRoles().forEach(role -> roles.add(new SimpleGrantedAuthority(role)));
        return new User(user.getUsername(), user.getPassword(), roles);
    }

    @Override
    public AppUser createUser(AppUser user) {
        user.setRole("USER");
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    @Override
    public AppUser updateUser(AppUser user) {
        return userRepo.save(user);
    }

    @Override
    public Optional<AppUser> checkUser(String username) {
        return userRepo.findByUsername(username);
    }

    @Override
    public Optional<AppUser> getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    @Override
    public Optional<AppUser> getUserById(long id) {
        return userRepo.findById(id);
    }

    @Override
    public Optional<AppUser> getUserRefById(long id) {
        return Optional.of(userRepo.getReferenceById(id));
    }

    @Override
    public Set<AppUser> getUsers() {
        return new HashSet<>(userRepo.findAll());
    }
}
