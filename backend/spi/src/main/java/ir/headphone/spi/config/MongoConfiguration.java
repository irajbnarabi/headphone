package ir.headphone.spi.config;

import lombok.Data;

@Data
public class MongoConfiguration {
    private String host;
    private Integer port;
    private String database;
    private String username;
    private String password;

    public MongoConfiguration(String host, Integer port, String database, String username, String password) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.username = username;
        this.password = password;
    }
}
