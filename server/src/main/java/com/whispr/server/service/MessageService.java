package com.whispr.server.service;

import com.whispr.server.entity.Message;

import java.util.List;

public interface MessageService {
    List<Message> findAllByRoomId(String id);
    void saveMessage(Message message);
    void deleteMessage(long id);
}
