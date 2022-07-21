package com.whispr.server.repository;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    ChatRoom findById(long id);
    Optional<ChatRoom> findByUsers(Set<AppUser> users);
}
