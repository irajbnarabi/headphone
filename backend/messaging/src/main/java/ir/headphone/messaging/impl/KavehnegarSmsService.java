package ir.headphone.messaging.impl;

import com.kavenegar.sdk.KavenegarApi;
import com.kavenegar.sdk.excepctions.ApiException;
import com.kavenegar.sdk.excepctions.HttpException;
import com.kavenegar.sdk.models.SendResult;
import ir.headphone.messaging.SmsService;
import ir.headphone.messaging.TemplateEngine;
import ir.headphone.messaging.conf.MessagingExternalConfig;
import ir.headphone.messaging.error.MessagingException;
import ir.headphone.spi.error.RateLimited;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KavehnegarSmsService implements SmsService, InitializingBean {
    private final TemplateEngine templateEngine;
    private final KavenegarApi kavenegarApi;
    private final String defaultSender;
    private final Boolean enabled;
    private final MessagingExternalConfig config;
    private final Map<String, SentSmsInfo> sentSmsMap = new ConcurrentHashMap<>();
    private final org.apache.logging.log4j.Logger logger = LogManager.getLogger(KavehnegarSmsService.class);

    public KavehnegarSmsService(TemplateEngine templateEngine, MessagingExternalConfig config) {
        this.templateEngine = templateEngine;
        this.config = config;
        this.kavenegarApi = new KavenegarApi(config.getKavehnegarApiKey());
        this.defaultSender = config.getDefaultSmsSender();
        this.enabled = config.getSmsEnabled();
    }

    private void checkTooManyTries(String recipient) {
        SentSmsInfo sentSmsInfo = sentSmsMap.get(recipient);
        if (sentSmsInfo != null) {
            if (sentSmsInfo.lastSentDate < DateUtils.addMinutes(new Date(), -1 * config.getMinTimeBetweenTwoSmsMinutes()).getTime()) {
                sentSmsInfo.count++;
                sentSmsInfo.lastSentDate = System.currentTimeMillis();
            } else {
                throw new RateLimited(recipient);
            }
        } else {
            sentSmsInfo = new SentSmsInfo(recipient, System.currentTimeMillis(), 1);
            sentSmsMap.put(recipient, sentSmsInfo);
        }
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        Thread thread = new Thread(() -> {
            while (true) {
                for (SentSmsInfo sent : sentSmsMap.values()) {
                    if (sent.lastSentDate < DateUtils.addHours(new Date(), -1 * config.getMaxSmsCountResetPeriodHours()).getTime()) {
                        sentSmsMap.remove(sent.recipient);
                    }
                }
                try {
                    Thread.sleep(10 * 60 * 1000);
                } catch (InterruptedException ignored) {

                }
            }
        });
        thread.start();
    }

    @Override
    @Async
    public void send(String recipient, String message) {
        send(defaultSender, recipient, message);
    }

    @Override
    @Async
    public void send(String sender, String recipient, String content) {
        if (!enabled) {
            return;
        }
        checkTooManyTries(recipient);
        try {
            kavenegarApi.send(sender, recipient, content);
        } catch (HttpException | ApiException ex) {
            throw new MessagingException(ex.getMessage());
        }

    }

    @Override
    @Async
    public void verifyLookup(String recipient, String token) {
        if (!enabled) {
            logger.info("sms service is disabled");
            return;
        }
        checkTooManyTries(recipient);
        try {
            logger.info(String.format("sending %s to %s", token, recipient));
            SendResult result = kavenegarApi.verifyLookup(recipient, token, config.getVerifyTemplate());
            logger.info(String.format("code %s sent to user %s, status: %s, result: %s", token, recipient, result.getStatusText(), result.getMessage()));
        } catch (HttpException | ApiException ex) {
            throw new MessagingException(ex.getMessage());
        }
    }

    @Override
    @Async
    public void send(String recipient, String template, Map<String, Object> data) {
        send(defaultSender, recipient, template, data);
    }

    @Override
    public void send(List<String> recipient, String template, Map<String, Object> data) {
        if (!enabled) {
            return;
        }
        try {
            kavenegarApi.send(config.getDefaultSmsSender(), recipient, templateEngine.render(data, template));
        } catch (HttpException | ApiException ex) {
            throw new MessagingException(ex.getMessage());
        }
    }

    @Override
    @Async
    public void send(String sender, String recipient, String template, Map<String, Object> data) {
        send(sender, recipient, templateEngine.render(data, template));
    }

    private static class SentSmsInfo {
        private final String recipient;
        private Long lastSentDate;
        private Integer count;

        public SentSmsInfo(String recipient, Long lastSentDate, Integer count) {
            this.recipient = recipient;
            this.lastSentDate = lastSentDate;
            this.count = count;
        }
    }
}
