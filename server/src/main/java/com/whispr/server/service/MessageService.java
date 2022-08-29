package com.whispr.server.service;

import com.whispr.server.model.Message;

import java.util.List;
import java.util.Set;

public interface MessageService {
    List<Message> findAllByRoomId(String id);
    void saveMessage(Message message);
    void deleteMessage(long id);
}
