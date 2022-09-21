package ir.headphone.messaging;

import java.util.List;
import java.util.Map;

public interface SmsService {
    void send(String recipient, String content);

    void send(String sender, String recipient, String content);

    void verifyLookup(String recipient, String token);

    void send(String recipient, String template, Map<String, Object> data);

    void send(List<String> recipient, String template, Map<String, Object> data);

    void send(String sender, String recipient, String template, Map<String, Object> data);
}
