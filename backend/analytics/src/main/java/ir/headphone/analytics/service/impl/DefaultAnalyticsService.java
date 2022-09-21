package ir.headphone.analytics.service.impl;

import ir.headphone.analytics.error.AnalyticsException;
import ir.headphone.analytics.model.dentity.EventEntity;
import ir.headphone.analytics.repository.EventRepository;
import ir.headphone.helper.calendar.persian.PersianCalendar;
import ir.headphone.spi.analytics.model.Event;
import ir.headphone.spi.analytics.service.AnalyticsService;
import ir.headphone.spi.model.PageSize;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

public class DefaultAnalyticsService implements AnalyticsService {
    private static final ZoneId defaultZoneId = ZoneId.of("Asia/Tehran");
    private static final ZoneOffset defaultZoneOffset = ZoneOffset.of("+03:30");
    private final EventRepository eventRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public EventRepository getEventRepository() {
        return eventRepository;
    }

    public DefaultAnalyticsService(EventRepository eventRepository, RedisTemplate<String, String> redisTemplate) {
        this.eventRepository = eventRepository;
        this.redisTemplate = redisTemplate;
        GenericToStringSerializer<Object> keySerializer = new GenericToStringSerializer<>(Object.class);
        this.redisTemplate.setKeySerializer(keySerializer);
        this.redisTemplate.setValueSerializer(keySerializer);
        this.redisTemplate.setHashKeySerializer(keySerializer);
        this.redisTemplate.setHashValueSerializer(keySerializer);
    }

    private static String getLabel(int i, int max, Integer prefix) {
        switch (max) {
            case 24:
                return String.format("%02d:00", i);
            case 30:
                return String.format("%02d/%02d", prefix, i);
            case 12:
                return String.format("%04d/%02d", prefix, i);
            case 0:
                return String.format("%04d", i);

        }
        return "";
    }

    private Map<String, String> getEpochs(Long from, Long to) {
        if (to == 0) {
            to = System.currentTimeMillis();
        } else {
            to = to * 1000;
        }
        if (from == 0) {
            from = to - 1000L * 3600 * 24 * 30;
        } else {
            from *= 1000;
        }
        LocalTime zero = LocalTime.of(0, 0);
        Instant f = Instant.ofEpochMilli(from);
        Instant t = Instant.ofEpochMilli(to);
        LocalDate lf = LocalDate.ofInstant(f, defaultZoneId);
        LocalDate lt = LocalDate.ofInstant(t, defaultZoneId);
        long fEpoch = lf.toEpochSecond(zero, defaultZoneOffset) * 1000;
        long tEpoch = lt.toEpochSecond(zero, defaultZoneOffset) * 1000 + 86400000;
        Map<String, String> result = new LinkedHashMap<>();
        long diff = tEpoch - fEpoch;
        long hour = 1000L * 3600;
        long day = hour * 24;
        long month = day * 31;
        long year = day * 366;
        TimeZone timeZone = TimeZone.getTimeZone("Asia/Tehran");

        if (diff == 0 || diff == 86400000) {
            for (int i = 0; i < 24; i++) {
                result.put(getLabel(i, 24, null), String.format("%d:%d", fEpoch + (i * hour), fEpoch + ((i + 1) * hour)));
            }
            return result;
        }
        /////////////////////////////
        if (diff <= month) {
            while (fEpoch < tEpoch) {
                PersianCalendar calendar = new PersianCalendar(timeZone, fEpoch);
                result.put(getLabel(calendar.getPersianDay(), 30, calendar.getPersianMonth()), String.format("%d:%d", fEpoch, fEpoch + day));
                fEpoch += day;
            }
            return result;
        }
        /////////////////////////////
        if (diff <= year) {
            PersianCalendar calendar = new PersianCalendar(timeZone, tEpoch);
            int m = calendar.getPersianDay();
            while (calendar.getPersianDay() == m) {
                tEpoch = tEpoch + day;
                calendar = new PersianCalendar(timeZone, tEpoch);
            }
            calendar = new PersianCalendar(timeZone, fEpoch);
            while (calendar.getPersianDay() != 1) {
                fEpoch = fEpoch - day;
                calendar = new PersianCalendar(timeZone, fEpoch);
            }
            while (fEpoch < tEpoch) {
                calendar = new PersianCalendar(timeZone, fEpoch);
                long tfEpoch = fEpoch;
                m = calendar.getPersianMonth();
                while (m == calendar.getPersianMonth()) {
                    tfEpoch += day;
                    calendar = new PersianCalendar(timeZone, tfEpoch);
                }
                calendar = new PersianCalendar(timeZone, fEpoch);
                result.put(getLabel(calendar.getPersianMonth(), 12, calendar.getPersianYear()), String.format("%d:%d", fEpoch, tfEpoch));
                m = calendar.getPersianMonth();
                while (m == calendar.getPersianMonth()) {
                    fEpoch += day;
                    calendar = new PersianCalendar(timeZone, fEpoch);
                }
            }
            return result;
        }
        /////////////////////////////
        PersianCalendar calendar = new PersianCalendar(timeZone, tEpoch);
        int m = calendar.getPersianYear();
        while (calendar.getPersianYear() == m) {
            tEpoch = tEpoch + day;
            calendar = new PersianCalendar(timeZone, tEpoch);
        }
        calendar = new PersianCalendar(timeZone, fEpoch);
        m = calendar.getPersianYear();
        while (calendar.getPersianYear() == m) {
            fEpoch = fEpoch - day;
            calendar = new PersianCalendar(timeZone, fEpoch);
        }
        fEpoch += day;
        while (fEpoch < tEpoch) {
            calendar = new PersianCalendar(timeZone, fEpoch);
            long tfEpoch = fEpoch;
            m = calendar.getPersianYear();
            while (m == calendar.getPersianYear()) {
                tfEpoch += day;
                calendar = new PersianCalendar(timeZone, tfEpoch);
            }
            calendar = new PersianCalendar(timeZone, fEpoch);

            result.put(getLabel(calendar.getPersianYear(), 0, null), String.format("%d:%d", fEpoch, tfEpoch));
            m = calendar.getPersianYear();
            while (m == calendar.getPersianYear()) {
                fEpoch += day;
                calendar = new PersianCalendar(timeZone, fEpoch);
            }
        }

        return result;
    }


    @Override
    public void save(Event event) {
        eventRepository.save(new EventEntity(event));
    }

    @Override
    public List<? extends Event> getEvents(String event, String device, Map<String, Object> data,
                                           Long from, Long to, PageSize pageSize) {
        Map<String, String> epochs = getEpochs(from, to);
        Long start = null;
        Long end = null;
        for (String k : epochs.keySet()) {
            if (start == null) {
                start = Long.parseLong(epochs.get(k).split(":")[0]);
            }
            end = Long.parseLong(epochs.get(k).split(":")[1]);
        }
        return eventRepository.findEvents(event, device, data, start, end,
                PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public Map<String, Long> statistics(String event, String device, Map<String, Object> data, Long from, Long to) {
        Map<String, Long> result = new LinkedHashMap<>();
        if (to < from) {
            throw new AnalyticsException("bad request", 400);
        }

        Map<String, String> epochs = getEpochs(from, to);
        for (String k : epochs.keySet()) {
            long start = Long.parseLong(epochs.get(k).split(":")[0]);
            long end = Long.parseLong(epochs.get(k).split(":")[1]);
            Long s = eventRepository.countEvents(event, device, data, start, end);
            result.put(k, s);
        }
        return result;
    }

    @Override
    public Map<String, Long> getHots(String event, String device, Map<String, Object> data, Long from, Long to) {
        int page = 0, size = 1000;
        List<? extends Event> events = getEvents(event, device, data, from, to, PageSize.of(page++, size));
        Map<String, Long> views = new HashMap<>();
        while (events.size() > 0) {
            for (Event e : events) {
                String mapKey = e.getData() != null && e.getData().get("id") != null ? (String) e.getData().get("id") : null;
                if (event.equals("search")) {
                    mapKey = e.getData() != null && e.getData().get("q") != null ? (String) e.getData().get("q") : null;
                }
                if (event.equals("discount")) {
                    mapKey = e.getData() != null && e.getData().get("voucher") != null ? (String) e.getData().get("voucher") : null;
                }
                if (mapKey == null) {
                    continue;
                }
                if (views.containsKey(mapKey)) {
                    views.put(mapKey, views.get(mapKey) + 1);
                } else {
                    views.put(mapKey, 1L);
                }
            }

            events = getEvents(event, device, data, from, to, PageSize.of(page++, size));
        }

        return views;
    }
}
