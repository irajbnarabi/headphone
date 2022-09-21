package ir.headphone.spi.model;

public interface Entity {
    String getId();

    void setId(String id);

    Long getCreatedAt();

    void setCreatedAt(Long createdAt);

    Long getUpdatedAt();

    void setUpdatedAt(Long updatedAt);
}
