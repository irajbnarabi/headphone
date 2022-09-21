package ir.headphone.messaging.conf;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Data
@Configuration
@ConfigurationProperties(prefix = "messaging")
public class MessagingExternalConfig {
    private String defaultSmsSender;
    private String kavehnegarApiKey;
    private Boolean smsEnabled;
    private Boolean emailEnabled;
    private Integer maxSmsCountPerMobile;
    private Integer maxSmsCountResetPeriodHours;
    private Integer minTimeBetweenTwoSmsMinutes;
    private String verifyTemplate;

    public MessagingExternalConfig() {
    }

    public MessagingExternalConfig(Environment environment) {
        this.defaultSmsSender = environment.getProperty("messaging.defaultSmsSender", String.class);
        this.kavehnegarApiKey = environment.getProperty("messaging.kavehnegarApiKey", String.class);
        this.smsEnabled = environment.getProperty("messaging.smsEnabled", Boolean.class);
        this.emailEnabled = environment.getProperty("messaging.email.enabled", Boolean.class);
        this.maxSmsCountPerMobile = environment.getProperty("messaging.maxSmsCountPerMobile", Integer.class);
        this.maxSmsCountResetPeriodHours = environment.getProperty("messaging.maxSmsCountResetPeriodHours", Integer.class);
        this.minTimeBetweenTwoSmsMinutes = environment.getProperty("messaging.minTimeBetweenTwoSmsMinutes", Integer.class);
        this.verifyTemplate = environment.getProperty("messaging.verifyTemplate", String.class);
    }
}
