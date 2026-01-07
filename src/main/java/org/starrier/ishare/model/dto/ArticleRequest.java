package org.starrier.ishare.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Article Request DTO
 * 
 * @author Starrier
 */
@Data
public class ArticleRequest {
    @NotBlank(message = "Title cannot be empty")
    private String title;
    
    @NotBlank(message = "Content cannot be empty")
    private String content;
    
    @NotNull(message = "Category ID cannot be null")
    private Integer categoryId;
    
    private String author;
    private String summary;
}
