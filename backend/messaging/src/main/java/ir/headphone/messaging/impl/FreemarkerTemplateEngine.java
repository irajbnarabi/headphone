package ir.headphone.messaging.impl;

import freemarker.template.Configuration;
import freemarker.template.Template;
import ir.headphone.messaging.TemplateEngine;
import ir.headphone.messaging.error.MessagingException;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FreemarkerTemplateEngine implements TemplateEngine {
    private final Map<String, Template> cache = new ConcurrentHashMap<>();
    private final Configuration configuration;

    public FreemarkerTemplateEngine() {
        this.configuration = new Configuration(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS);
        this.configuration.setEncoding(Locale.forLanguageTag("fa-IR"), "UTF-8");
        this.configuration.setURLEscapingCharset("UTF-8");
        this.configuration.setOutputEncoding("UTF-8");
        this.configuration.setDefaultEncoding("UTF-8");
        this.configuration.setClassForTemplateLoading(this.getClass(), "/templates/");

    }

    @Override
    public String render(Map<String, Object> data, String template) {
        try {
            Template cachedTemplate = cache.get(template);
            if (cachedTemplate == null) {
                cachedTemplate = configuration.getTemplate(template);
                cache.put(template, cachedTemplate);
            }
            return FreeMarkerTemplateUtils.processTemplateIntoString(cachedTemplate, data);
        } catch (Exception ex) {
            throw new MessagingException(ex.getMessage());
        }
    }
}
