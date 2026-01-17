# Telegram Clone 项目技术契约

## 1. 技术栈上下文

- **后端**: Java 21, Spring Boot 4.0.1, Gradle, MySQL 8.0
- **通讯**: WebSocket (stomp协议), Spring WebFlux (Reactive)
- **安全**: Spring Security + JWT
- **前端**: React 18 (Hooks), Redux Toolkit, Vite

## 2. 核心数据模型 (Entity/DTO)

### Message (消息实体)

- `id`: Long (Primary Key)
- `senderId`: Long (发送者ID)
- `receiverId`: Long (接收者ID/群组ID)
- `content`: Text (消息内容)
- `type`: Enum (TEXT, IMAGE, FILE, VOICE)
- `status`: Enum (SENDING, SENT, DELIVERED, READ)
- `createdAt`: Timestamp

## 3. API 设计准则

- 所有 REST API 必须返回 `Result<T>` 统一格式。
- 分页使用 `Pageable` 对象。
- 路径风格：`/api/v1/...`

## 4. WebSocket 约定

- 建立连接端点:  `/ws-chat`
- 订阅个人消息: `/user/{userId}/queue/messages`
- 发送消息目的地: `/app/chat. send`

## 5. 代码要求
- 所有注释全部使用简体中文
- 遵循 Java 编码规范 (Google Java Style Guide)。
- 使用 Lombok 减少样板代码。
- 所有数据库操作必须通过 Spring Data JPA 完成，禁止使用原生 SQL。
- 单元测试覆盖率不低于 80%。
- 日志使用 SLF4J + Logback，日志级别根据环境配置。
- 异常处理必须统一通过 `@ControllerAdvice` 进行。
- 所有敏感信息（如密码、令牌）必须加密存储和传输。
- 所有的代码必须按照模块化设计，确保高内聚低耦合。同时要严格遵循Documents/后端目录结构设计. md和Documents/功能实现细分. md中的规范。