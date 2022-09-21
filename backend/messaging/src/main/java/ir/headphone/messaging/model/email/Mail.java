package ir.headphone.messaging.model.email;

import ir.headphone.messaging.error.MessagingException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Base64Utils;

import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Part;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Mail {
    private String from;
    private List<String> to;
    private List<String> cc;
    private List<String> bcc;
    private String subject;
    private String content;
    private String contentType;
    private List<Attachment> attachments;

    public Mail() {
        to = new ArrayList<>();
        cc = new ArrayList<>();
        bcc = new ArrayList<>();
        attachments = new ArrayList<>();
    }

    public Mail(String from, List<String> to, List<String> cc, List<String> bcc, String subject, String content, String contentType, List<Attachment> attachments) {
        this.from = from;
        this.to = to;
        this.cc = cc;
        this.bcc = bcc;
        this.subject = subject;
        this.content = content;
        this.contentType = contentType;
        this.attachments = attachments;
    }

    public Mail(Message message) throws MessagingException {
        try {
            this.from = message.getFrom()[0].toString();
            this.to = new ArrayList<>();
            this.cc = new ArrayList<>();
            this.bcc = new ArrayList<>();
            try {
                for (Address address : message.getRecipients(Message.RecipientType.TO)) {
                    to.add(address.toString());
                }
            } catch (NullPointerException ignored) {
            }
            try {
                for (Address address : message.getRecipients(Message.RecipientType.CC)) {
                    cc.add(address.toString());
                }
            } catch (NullPointerException ignored) {
            }
            try {
                for (Address address : message.getRecipients(Message.RecipientType.BCC)) {
                    bcc.add(address.toString());
                }
            } catch (NullPointerException ignored) {
            }
            this.subject = message.getSubject();
            attachments = new ArrayList<>();
            try {
                Multipart multipart = (Multipart) message.getContent();
                for (int i = 0; i < multipart.getCount(); i++) {
                    BodyPart bodyPart = multipart.getBodyPart(i);
                    if (!Part.ATTACHMENT.equalsIgnoreCase(bodyPart.getDisposition()) && !StringUtils.isNotBlank(bodyPart.getFileName())) {
                        int ii = 0;
                        while (!bodyPart.isMimeType("text/*")) {
                            bodyPart = ((Multipart) bodyPart.getContent()).getBodyPart(0);
                            if (ii++ > 10) break;
                        }
                        this.content = (String) bodyPart.getContent();
                        this.contentType = bodyPart.getContentType();
                    } else {
                        InputStream is = bodyPart.getInputStream();
                        ByteArrayOutputStream os = new ByteArrayOutputStream();
                        byte[] buf = new byte[4096];
                        int bytesRead;
                        while ((bytesRead = is.read(buf)) != -1) {
                            os.write(buf, 0, bytesRead);
                        }
                        os.close();
                        String base64Content = Base64Utils.encodeToString(os.toByteArray());
                        Attachment attachment = new Attachment(base64Content, bodyPart.getFileName());
                        attachments.add(attachment);
                    }
                }
            } catch (Exception ex) {
                this.content = (String) message.getContent();
                this.contentType = message.getContentType();
            }
        } catch (Exception ex) {
            throw new MessagingException(ex.getMessage());
        }
    }

    public void addTo(String to) {
        this.to.add(to);
    }

    public void addCc(String cc) {
        this.cc.add(cc);
    }

    public void addBcc(String bcc) {
        this.bcc.add(bcc);
    }

    public void addAttachment(Attachment attachment) {
        if (attachments == null) {
            attachments = new ArrayList<>();
        }
        this.attachments.add(attachment);
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<String> getTo() {
        return to;
    }

    public void setTo(List<String> to) {
        this.to = to;
    }

    public List<String> getCc() {
        return cc;
    }

    public void setCc(List<String> cc) {
        this.cc = cc;
    }

    public List<String> getBcc() {
        return bcc;
    }

    public void setBcc(List<String> bcc) {
        this.bcc = bcc;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }
}
