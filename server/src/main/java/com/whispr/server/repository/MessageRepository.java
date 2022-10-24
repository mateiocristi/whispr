package com.whispr.server.repository;

import com.whispr.server.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByRoomId(String id);

    @Modifying
    @Query(value = "update message m set is_read = true where m.room_id = :crId and m.user_id = :userId", nativeQuery = true)
    void setMessagesRead(@Param("crId") String chatRoomId, @Param("userId") long userId);

    @Modifying
    @Query(value = "update message m set m.is_read = true where m.id = : mId", nativeQuery = true)
    void setMessageRead(@Param("mId") long messageId);
}
