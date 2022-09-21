package ir.headphone.rest.controller.interceptor;

import ir.headphone.rest.service.impl.SecurityService;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SecurityInterceptor extends HandlerInterceptorAdapter {
    private final SecurityService securityService;

    public SecurityInterceptor(SecurityService securityService) {
        this.securityService = securityService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("X-User-Token");
        String path = request.getRequestURI();
        String method = request.getMethod();
        if (!securityService.hasPermission(token, method, path)) {
            response.sendError(403);
            return false;
        }
        return true;
    }
}
