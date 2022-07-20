package com.whispr.server.model;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class EndUser {

    private long id;
    private String username;

}
