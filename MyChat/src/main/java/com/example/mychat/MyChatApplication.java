package com.example.mychat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(excludeName = {
        "org.springframework.boot.data.r2dbc.autoconfigure.R2dbcRepositoriesAutoConfiguration",
        "org.springframework.boot.data.redis.autoconfigure.RedisRepositoriesAutoConfiguration"
})
@EnableJpaRepositories(basePackages = "com.example.mychat")
public class MyChatApplication {

    public static void main(String[] args) {

        SpringApplication.run(MyChatApplication.class, args);
        System.out.println("""
                ╔════════════════════════════════════════════╗
                ║   Telegram Chat Backend Started!           ║
                ║   Version: 1.0.0                           ║
                ║   JDK: 21                                  ║
                ║   Spring Boot: 4.0.1                       ║
                ╚════════════════════════════════════════════╝
                """);
    }

}
