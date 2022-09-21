package ir.headphone.messaging;

import java.util.List;
import java.util.Map;

public interface MailService {
    void send(String from, String to, String subject, String template, Map<String, Object> data);

    void send(String from, String to, String subject, String content);

    void send(String from, List<String> to, String subject, String template, Map<String, Object> data);
}
