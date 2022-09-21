package ir.headphone.spi.social.model;

import ir.headphone.spi.model.Entity;

public interface AvgRate extends Entity {
    String getEntityId();

    Float getRate();

    Long getRateCount();
}
