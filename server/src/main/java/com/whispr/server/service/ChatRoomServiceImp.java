package com.whispr.server.service;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import com.whispr.server.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    public Optional<ChatRoom> getRoomById(String id) {
        return Optional.ofNullable(roomRepo.findById(id));

    }

    @Override
    public void addNewRoom(ChatRoom room) {
        roomRepo.save(room);
    }

    @Override
    public ChatRoom getRoomByUsers(List<AppUser> users) {
        Optional<ChatRoom> chatRoomOptional = Optional.ofNullable(roomRepo.findById(roomRepo.calcRoomId(users.get(0).getUsername(), users.get(1).getUsername())));
        if (chatRoomOptional.isEmpty()) {
            return handleChatRoom(chatRoomOptional, users);
        } else
            return chatRoomOptional.get();
    }

    private ChatRoom handleChatRoom(Optional<ChatRoom> chatRoomOptional, List<AppUser> users) {
        if (chatRoomOptional.isEmpty()) {
            System.out.println("is empty");
            ChatRoom chatRoom = ChatRoom.builder().build();
            chatRoom.setUsers(users);
            chatRoom.setId(roomRepo.calcRoomId(users.get(0).getUsername(), users.get(1).getUsername()));
            return roomRepo.save(chatRoom);
        }

        else
            return chatRoomOptional.get();
    }


}
