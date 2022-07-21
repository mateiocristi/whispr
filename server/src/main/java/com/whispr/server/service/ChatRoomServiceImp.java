package com.whispr.server.service;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import com.whispr.server.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChatRoomServiceImp implements ChatRoomService {

    private final ChatRoomRepository roomRepo;

    @Override
    public Set<ChatRoom> getAllRooms() {
//        return (Set<ChatRoom>) roomRepo.findAll();
        return null;
    }

    @Override
    public ChatRoom getRoomById(long id) {
        Optional<ChatRoom> chatRoomOptional = Optional.ofNullable(roomRepo.findById(id));
        return handleChatRoom(chatRoomOptional);
    }

    @Override
    public void addNewRoom(ChatRoom room) {
        roomRepo.save(room);
    }

    @Override
    public ChatRoom getRoomByUsers(Set<AppUser> users) {
//        Optional<ChatRoom> chatRoomOptional = Optional.ofNullable(roomRepo.findByUsers(users));
//        return handleChatRoom(chatRoomOptional);
        return null;
    }

    private ChatRoom handleChatRoom(Optional<ChatRoom> chatRoomOptional) {
        if (chatRoomOptional.isEmpty())
            return roomRepo.save(ChatRoom.builder().build());
        else
            return chatRoomOptional.get();
    }
}
