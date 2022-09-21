package ir.headphone.messaging.impl;

import ir.headphone.messaging.MailService;
import ir.headphone.messaging.TemplateEngine;
import ir.headphone.messaging.conf.MessagingExternalConfig;
import ir.headphone.messaging.error.MessagingException;
import ir.headphone.messaging.model.email.Attachment;
import ir.headphone.messaging.model.email.Mail;
import ir.headphone.spi.error.ServiceException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.Base64Utils;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Service
public class DefaultMailService implements MailService {
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;
    private final MessagingExternalConfig config;


    public DefaultMailService(JavaMailSender javaMailSender,
                              TemplateEngine templateEngine,
                              MessagingExternalConfig config) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
        this.config = config;
    }

    private void doSend(Mail mail) {
        if (!config.getEmailEnabled()) {
            return;
        }
        javaMailSender.send(createMimeMessage(mail, Session.getDefaultInstance(new Properties())));
    }

    @Override
    @Async
    public void send(String from, String to, String subject, String template, Map<String, Object> data) {
        Mail mail = new Mail();
        mail.setSubject(subject);
        mail.setContent(templateEngine.render(data, template));
        mail.setFrom(from);
        mail.addTo(to);
        doSend(mail);
    }

    @Override
    public void send(String from, String to, String subject, String content) {
        Mail mail = new Mail();
        mail.setSubject(subject);
        mail.setContent(content);
        mail.setFrom(from);
        mail.addTo(to);
        doSend(mail);
    }

    @Override
    public void send(String from, List<String> bcc, String subject, String template, Map<String, Object> data) {
        Mail mail = new Mail();
        mail.setSubject(subject);
        mail.setContent(templateEngine.render(data, template));
        mail.setFrom(from);
        mail.setBcc(bcc);
        doSend(mail);
    }

    private MimeMessage createMimeMessage(Mail mail, Session session) throws ServiceException {
        try {
            MimeMessage mimeMessage = new MimeMessage(session);
            if (StringUtils.isNotBlank(mail.getFrom())) {
                mimeMessage.setFrom(new InternetAddress(mail.getFrom()));
            }
            for (String rec : mail.getTo())
                mimeMessage.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(rec));
            try {
                for (String rec : mail.getCc())
                    mimeMessage.addRecipient(javax.mail.Message.RecipientType.CC, new InternetAddress(rec));
            } catch (Exception ignored) {
            }
            try {
                for (String rec : mail.getBcc())
                    mimeMessage.addRecipient(javax.mail.Message.RecipientType.BCC, new InternetAddress(rec));
            } catch (Exception ignored) {
            }
            if (mail.getSubject() == null)
                mail.setSubject("");

            mimeMessage.setSubject(mail.getSubject(), "utf-8");

            Multipart mp = new MimeMultipart();

            MimeBodyPart part = new MimeBodyPart();
            if (mail.getContent() == null) {
                mail.setContent("");
            }
            if (StringUtils.isBlank(mail.getContentType()) || mail.getContentType().contains("/")) {
                mail.setContentType("html");
            }
            part.setText(mail.getContent(), "utf-8", mail.getContentType());
            int index = 0;
            mp.addBodyPart(part, index++);
            if (mail.getAttachments() != null && mail.getAttachments().size() > 0) {
                for (Attachment attachment : mail.getAttachments()) {
                    part = new MimeBodyPart();
                    DataSource source = new ByteArrayDataSource(Base64Utils.decodeFromString(attachment.getBase64Content()),
                            "application/octet-stream");
                    part.setDataHandler(new DataHandler(source));
                    part.setFileName(attachment.getFileName());
                    mp.addBodyPart(part, index++);
                }
            }
            mimeMessage.setContent(mp);
            return mimeMessage;
        } catch (Exception e) {
            throw new MessagingException(e.getMessage());
        }
    }

}
