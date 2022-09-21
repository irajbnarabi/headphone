package ir.headphone.spi.analytics.service;

import ir.headphone.spi.analytics.model.Event;
import ir.headphone.spi.model.PageSize;

import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    void save(Event event);

    Map<String, Long> statistics(String event, String device, Map<String, Object> data, Long from, Long to);

    Map<String, Long> getHots(String event, String device, Map<String, Object> data, Long from, Long to);

    List<? extends Event> getEvents(String event, String device, Map<String, Object> data, Long from, Long to, PageSize pageSize);
}
