package ir.headphone.rest.controller.video.dto;

import lombok.Data;

@Data
public class Likes {
    private Integer likes;
    private Integer dislikes;
    private Boolean likeByUser;
    private Boolean dislikeByUser;
}
