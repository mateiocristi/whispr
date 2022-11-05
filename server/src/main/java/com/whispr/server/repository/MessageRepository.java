package com.whispr.server.repository;

import com.whispr.server.entity.Message;
import com.whispr.server.model.MessageModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByRoomId(String id);

    @Query(value = "select new com.whispr.server.model.MessageModel(m.id, m.messageText, m.timestamp, m.isRead, m.room.id, m.user.id) from Message m where m.room.id = :roomId")
    List<MessageModel> getAllWithRoomId(@Param("roomId") String roomId);

    @Modifying
    @Query("update Message m set m.isRead = true where m.room.id = :crId and m.user.id = :userId")
    void setMessagesRead(@Param("crId") String chatRoomId, @Param("userId") long userId);

    @Modifying
    @Query(value = "update Message m set m.isRead = true where m.id = : mId")
    void setMessageRead(@Param("mId") long messageId);
}
