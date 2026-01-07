package org.starrier.ishare.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger Configuration
 * 
 * @author Starrier
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI iShareOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("iShare Project API Docs")
                        .description("iShare Project - A modern blog platform")
                        .version("2.0.0")
                        .license(new License().name("MIT").url("")));
    }
}