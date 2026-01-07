package org.starrier.ishare.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Comment Request DTO
 * 
 * @author Starrier
 */
@Data
public class CommentRequest {
    @NotNull(message = "Article ID cannot be null")
    private Integer articleId;
    
    @NotBlank(message = "Comment content cannot be empty")
    private String content;
}
