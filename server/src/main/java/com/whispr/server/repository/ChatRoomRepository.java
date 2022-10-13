package com.whispr.server.repository;

import com.whispr.server.entity.ChatRoom;
import com.whispr.server.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    @Query(value = "select * from chat_room cr inner join chat_room_users cru on cr.id = cru.chat_room_id where cru.users_id = :userId", nativeQuery = true)
    List<ChatRoom> findAllChatRoomsBy_UserId(@Param("userId") long userId);

    @Query(value = "select * from chat_room cr where cr.id = :id", nativeQuery = true)
    Optional<ChatRoom> findChatRoomBy_Id(@Param("id") String chatRoomId);

}
