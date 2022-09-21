package ir.headphone.rest.model;

import lombok.Data;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Data
public class ServiceResult {
    private Integer code;
    private String message;
    private Object data;
    private Map<String, Object> metadata;

    public ServiceResult() {

    }

    public ServiceResult(Object data) {
        this(200, "success", data);
    }

    public ServiceResult(Integer code, Object data) {
        this(code, "", data);
    }

    public ServiceResult(Integer code, String message, Object data) {
        this.message = message;
        this.code = code;
        if (data == null) {
            data = Collections.emptyList();
        }
        this.data = data;
    }

    public ServiceResult(Integer code, String message, Object data, Map<String, Object> metadata) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.metadata = metadata;
    }

    public void addMetadataItem(String key, Object value) {
        if (metadata == null) {
            metadata = new HashMap<>();
        }
        metadata.put(key, value);
    }
}
