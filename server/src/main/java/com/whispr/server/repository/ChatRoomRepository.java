package com.whispr.server.repository;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    @Query(value = "select * from chat_room cr inner join chat_room_users cru on cr.id = cru.chat_room_id where cru.users_id = :userId", nativeQuery = true)
    List<ChatRoom> findAllByUser_usersId(@Param("userId") long userId);
}
