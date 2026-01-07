package org.starrier.ishare.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Register Request DTO
 * 
 * @author Starrier
 */
@Data
public class RegisterRequest {
    @NotBlank(message = "Username cannot be empty")
    private String username;
    
    @NotBlank(message = "Password cannot be empty")
    private String password;
    
    @NotBlank(message = "Re-password cannot be empty")
    private String rePassword;
}
