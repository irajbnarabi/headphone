package ir.headphone.rest.controller.interceptor;

import ir.headphone.spi.user.service.ContextHolder;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ContextInterceptor extends HandlerInterceptorAdapter {
    private final ContextHolder contextHolder;

    public ContextInterceptor(ContextHolder contextHolder) {
        this.contextHolder = contextHolder;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        contextHolder.update(request);
        return true;
    }
}
