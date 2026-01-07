package org.starrier.ishare;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * iShare Application
 * 
 * @author Starrier
 * @date 2024
 */
@SpringBootApplication
@MapperScan("org.starrier.ishare.dao")
public class IShareApplication {

    public static void main(String[] args) {
        SpringApplication.run(IShareApplication.class, args);
    }
}
