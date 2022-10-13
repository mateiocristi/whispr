package com.whispr.server.service;

import com.whispr.server.entity.AppUser;
import com.whispr.server.entity.ChatRoom;
import com.whispr.server.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChatRoomServiceImp implements ChatRoomService {

    private final ChatRoomRepository roomRepo;

    @Override
    public List<ChatRoom> getAllRoomsByUserId(long id) {
        return roomRepo.findAllChatRoomsBy_UserId(id);
    }

    @Override
    public Optional<ChatRoom> getChatRoomById(String id) {
        return roomRepo.findById(id);
    }

    @Override
    public ChatRoom getChatRoomRefById(String id) {
        return roomRepo.getReferenceById(id);
    }

    @Override
    public void addNewRoom(ChatRoom room) {
        roomRepo.save(room);
    }

    @Override
    public ChatRoom getRoomByUsers(AppUser user1, AppUser user2) {
        Optional<ChatRoom> chatRoomOptional = roomRepo.findChatRoomBy_Id(calcRoomId(user1.getUsername(), user2.getUsername()));
        if (chatRoomOptional.isEmpty()) {
            return createNewChatRoom(user1, user2);
        } else
            return chatRoomOptional.get();
    }

    private ChatRoom createNewChatRoom(AppUser user1, AppUser user2) {
        log.info("chat room not found ... creating a new one with id: " + calcRoomId(user1.getUsername(), user2.getUsername()));
        ChatRoom chatRoom = ChatRoom.builder().build();
        chatRoom.setUsers(Arrays.asList(user1, user2));
        chatRoom.setId(calcRoomId(user1.getUsername(), user2.getUsername()));
        return roomRepo.save(chatRoom);
    }
}
