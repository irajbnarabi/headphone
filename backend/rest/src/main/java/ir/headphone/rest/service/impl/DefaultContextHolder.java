package ir.headphone.rest.service.impl;

import com.google.common.net.InetAddresses;
import ir.headphone.rest.logger.Logger;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.service.ContextHolder;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;

public class DefaultContextHolder implements ContextHolder {
    private static final DefaultContextHolder contextHolder = new DefaultContextHolder();
    private final ThreadLocal<PageSize> pageSizeThreadLocal = new ThreadLocal<>();
    private final ThreadLocal<InetAddress> ipThreadLocal = new ThreadLocal<>();
    private final ThreadLocal<String> userTokenThreadLocal = new ThreadLocal<>();
    private final ThreadLocal<String> newUserTokenThreadLocal = new ThreadLocal<>();
    private final ThreadLocal<String> deviceThreadLocal = new ThreadLocal<>();
    private final ThreadLocal<String> osThreadLocal = new ThreadLocal<>();
    private final ThreadLocal<UserAgent> userAgentThreadLocal = new ThreadLocal<>();
    private final ThreadLocal<Long> pageCount = new ThreadLocal<>();
    private final UserAgentAnalyzer userAgentAnalyzer = UserAgentAnalyzer
            .newBuilder()
            .hideMatcherLoadStats()
            .withCache(10000)
            .build();

    private DefaultContextHolder() {
    }

    public static DefaultContextHolder getInstance() {
        return contextHolder;
    }

    public void update(Object request) {
        try {
            UserAgent userAgent = userAgentAnalyzer.parse(((HttpServletRequest) request).getHeader("User-Agent"));
            userAgentThreadLocal.set(userAgent);
        } catch (Exception ignored) {
        }
        setIpThreadLocal((HttpServletRequest) request);
        setUserTokenThreadLocal((HttpServletRequest) request);
        setPageSizeThreadLocal((HttpServletRequest) request);
        setIpThreadLocal((HttpServletRequest) request);
        setUserDevice((HttpServletRequest) request);
        setOs((HttpServletRequest) request);
        pageCount.remove();
    }

    public Long pageCount() {
        return pageCount.get();
    }

    public void setPageCount(Long pageCount) {
        this.pageCount.set(pageCount);
    }

    private void setUserDevice(HttpServletRequest request) {
        deviceThreadLocal.set("unknown");
        try {
            deviceThreadLocal.set(userAgentThreadLocal.get().getValue("DeviceName"));
        } catch (Exception ignored) {
        }
    }

    private void setOs(HttpServletRequest request) {
        osThreadLocal.set("unknown");
        try {
            osThreadLocal.set(userAgentThreadLocal.get().getValue("OperatingSystemNameVersion"));
        } catch (Exception ignored) {
        }
    }

    private void setPageSizeThreadLocal(HttpServletRequest request) {
        int page = 0;
        int size = 20;
        if (request.getParameter("page") != null) {
            page = Integer.parseInt(request.getParameter("page"));
            page = page - 1;
        }
        if (request.getParameter("size") != null) {
            size = Integer.parseInt(request.getParameter("size"));
        }
        if (page < 0) {
            page = 0;
        }
        if (size < 1 || size > 20) {
            size = 20;
        }
        this.pageSizeThreadLocal.set(PageSize.of(page, size));
    }

    private void setUserTokenThreadLocal(HttpServletRequest request) {
        this.userTokenThreadLocal.set(request.getHeader("x-user-token"));
    }

    private void setIpThreadLocal(HttpServletRequest request) {
        InetAddress ip = null;
        try {
            String remoteAddr = request.getHeader("x-forwarded-for");
            if (StringUtils.isBlank(remoteAddr)) {
                remoteAddr = request.getHeader("x-real-ip");
            }
            if (StringUtils.isBlank(remoteAddr)) {
                remoteAddr = request.getRemoteAddr();
            }
            String defaultIp = "127.0.0.1";// default IP
            try {
                ip = InetAddresses.forString(remoteAddr);
            } catch (Exception ignored) {
            }
            if (!remoteAddr.equals("0:0:0:0:0:0:0:1")) {
                if (remoteAddr.contains(",")) {
                    String[] ips = remoteAddr.split(",");
                    for (String i : ips) {
                        try {
                            ip = InetAddresses.forString(i);
                            break;
                        } catch (Exception e) {
                        }
                    }
                }
            } else {
                // localhost
                ip = null;
            }
            if (ip == null) {
                ip = InetAddresses.forString(defaultIp);
            }
        } catch (Exception e) {
            Logger.getInstance().error("Cannot resolve user IP address: " + e.getMessage());
        }
        this.ipThreadLocal.set(ip);
    }

    @Override
    public String userToken() {
        return userTokenThreadLocal.get();
    }

    @Override
    public String newUserToken() {
        return newUserTokenThreadLocal.get();
    }

    @Override
    public void setNewUserToken(String userToken) {
        newUserTokenThreadLocal.set(userToken);
    }

    @Override
    public String ip() {
        InetAddress inetAddress = ipThreadLocal.get();
        String ip = inetAddress.toString();
        if (ip.startsWith("/")) {
            ip = ip.substring(1);
        }
        return ip;
    }

    @Override
    public PageSize pageSize() {
        return pageSizeThreadLocal.get();
    }

    @Override
    public String device() {
        return deviceThreadLocal.get();
    }

    @Override
    public String os() {
        return osThreadLocal.get();
    }
}
