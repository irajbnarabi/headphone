package ir.headphone.spi.analytics.model;

import ir.headphone.spi.model.Entity;

import java.util.Map;

public interface Event extends Entity {
    String getName();

    String getDevice();

    String getOs();

    String getIp();

    String getUserId();

    Map<String, Object> getData();

    String getExtra();
}
