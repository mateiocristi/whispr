package com.whispr.server.model;

import com.whispr.server.entity.ChatRoom;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ChatRoomModel {
    private String id;
    private List<UserModel> users = new ArrayList<>();
    private List<MessageModel> messages = new ArrayList<>();

    public ChatRoomModel(ChatRoom chatRoom) {
        this.id = chatRoom.getId();
        chatRoom.getUsers().forEach(user -> this.users.add(new UserModel(user)));
        if (chatRoom.getMessages().size() != 0)
            chatRoom.getMessages().forEach(message -> this.messages.add(new MessageModel(message)));
    }
}
