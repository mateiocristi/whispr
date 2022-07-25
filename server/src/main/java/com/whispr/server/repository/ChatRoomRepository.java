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

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    ChatRoom findById(long id);
//    ChatRoom findByUsers(Set<AppUser> users);
    @Query(nativeQuery = true, value = "SELECT r.rooms_id FROM app_user_rooms r WHERE r.rooms_id in :users_id GROUP BY r.rooms_id HAVING COUNT(r.rooms_id) = :length")
    ChatRoom findChatRoomByUsers(@Param("users_id") Set<Long> users_id,@Param("length") int length);
}
