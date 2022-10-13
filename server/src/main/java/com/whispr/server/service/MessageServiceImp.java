package com.whispr.server.service;

import com.whispr.server.entity.Message;
import com.whispr.server.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MessageServiceImp implements MessageService {
    private final MessageRepository messageRepo;
    @Override
    public List<Message> findAllByRoomId(String id) {
        return messageRepo.findAllByRoomId(id);
    }

    @Override
    public void saveMessage(Message message) {
        messageRepo.save(message);
    }

    @Override
    public void deleteMessage(long id) {
        messageRepo.deleteById(id);
    }
}
