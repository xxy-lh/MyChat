package com.example.mychat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
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
