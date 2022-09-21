package ir.headphone.messaging;

import java.util.Map;

public interface TemplateEngine {
    String render(Map<String, Object> data, String template);
}
