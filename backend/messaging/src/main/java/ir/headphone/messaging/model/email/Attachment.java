package ir.headphone.messaging.model.email;

import org.springframework.util.Base64Utils;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Attachment {
    private String base64Content;
    private String fileName;

    public Attachment(String base64Content, String fileName) {
        this.base64Content = base64Content;
        this.fileName = fileName;
    }

    public Attachment(byte[] content, String fileName) {
        this.base64Content = Base64Utils.encodeToString(content);
        this.fileName = fileName;
    }

    /**
     * Create attachment using file uri, e.g. file:///home/jalal/logo.png
     *
     * @param uri path to file
     * @throws IOException
     */
    public Attachment(URI uri) throws IOException {
        this.base64Content = Base64Utils.encodeToString(Files.readAllBytes(Paths.get(uri)));
        String path = uri.getPath();
        int beginIndex = path.lastIndexOf('/') + 1;
        this.fileName = path.substring(beginIndex, path.indexOf('?') > beginIndex ? path.indexOf('?') : path.length());
    }

    public Attachment(URI uri, String fileName) throws IOException {
        this.base64Content = Base64Utils.encodeToString(Files.readAllBytes(Paths.get(uri)));
        this.fileName = fileName;
    }

    public String getBase64Content() {
        return base64Content;
    }

    public void setBase64Content(String base64Content) {
        this.base64Content = base64Content;
    }

    public void setContent(byte[] content) {
        this.base64Content = Base64Utils.encodeToString(content);
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
