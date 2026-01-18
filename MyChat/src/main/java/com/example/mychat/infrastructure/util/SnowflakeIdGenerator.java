package com.example.mychat.infrastructure.util;

import java.net.NetworkInterface;
import java.security.SecureRandom;
import java.util.Enumeration;

/**
 * 雪花算法 ID 生成器
 * 
 * 生成全局唯一且大致有序的 64位 ID
 * 结构: 1位符号位 + 41位时间戳 + 10位机器ID + 12位序列号
 */
public class SnowflakeIdGenerator {

    // 起始时间戳 (2024-01-01 00:00:00 UTC)
    private static final long EPOCH = 1704067200000L;

    // 机器ID位数
    private static final long WORKER_ID_BITS = 10L;

    // 序列号位数
    private static final long SEQUENCE_BITS = 12L;

    // 最大机器ID
    private static final long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);

    // 最大序列号
    private static final long MAX_SEQUENCE = ~(-1L << SEQUENCE_BITS);

    // 机器ID左移位数
    private static final long WORKER_ID_SHIFT = SEQUENCE_BITS;

    // 时间戳左移位数
    private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;

    // 机器ID
    private final long workerId;

    // 序列号
    private long sequence = 0L;

    // 上次生成ID的时间戳
    private long lastTimestamp = -1L;

    // 单例实例
    private static volatile SnowflakeIdGenerator instance;

    /**
     * 私有构造函数
     */
    private SnowflakeIdGenerator(long workerId) {
        if (workerId < 0 || workerId > MAX_WORKER_ID) {
            throw new IllegalArgumentException(
                    String.format("机器ID必须在 0 到 %d 之间", MAX_WORKER_ID));
        }
        this.workerId = workerId;
    }

    /**
     * 获取单例实例
     */
    public static SnowflakeIdGenerator getInstance() {
        if (instance == null) {
            synchronized (SnowflakeIdGenerator.class) {
                if (instance == null) {
                    instance = new SnowflakeIdGenerator(generateWorkerId());
                }
            }
        }
        return instance;
    }

    /**
     * 生成下一个ID
     */
    public synchronized long nextId() {
        long currentTimestamp = System.currentTimeMillis();

        // 如果当前时间小于上次生成ID的时间戳，说明时钟回拨
        if (currentTimestamp < lastTimestamp) {
            throw new RuntimeException(
                    String.format("时钟回拨，拒绝生成ID，回拨时间: %d 毫秒",
                            lastTimestamp - currentTimestamp));
        }

        // 如果是同一毫秒内生成的，序列号自增
        if (currentTimestamp == lastTimestamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            // 序列号溢出，等待下一毫秒
            if (sequence == 0) {
                currentTimestamp = waitNextMillis(lastTimestamp);
            }
        } else {
            // 不同毫秒，序列号重置
            sequence = 0L;
        }

        lastTimestamp = currentTimestamp;

        // 组装ID
        return ((currentTimestamp - EPOCH) << TIMESTAMP_SHIFT)
                | (workerId << WORKER_ID_SHIFT)
                | sequence;
    }

    /**
     * 等待下一毫秒
     */
    private long waitNextMillis(long lastTimestamp) {
        long timestamp = System.currentTimeMillis();
        while (timestamp <= lastTimestamp) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }

    /**
     * 根据网卡MAC地址生成机器ID
     */
    private static long generateWorkerId() {
        try {
            StringBuilder sb = new StringBuilder();
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();

            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface networkInterface = networkInterfaces.nextElement();
                byte[] mac = networkInterface.getHardwareAddress();
                if (mac != null) {
                    for (byte b : mac) {
                        sb.append(String.format("%02X", b));
                    }
                }
            }

            // 使用哈希值取模获取机器ID
            return Math.abs(sb.toString().hashCode()) % (MAX_WORKER_ID + 1);
        } catch (Exception e) {
            // 如果获取失败，使用随机数
            return new SecureRandom().nextInt((int) MAX_WORKER_ID + 1);
        }
    }
}
