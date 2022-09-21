package ir.headphone.rest.service.impl;

import ir.headphone.spi.user.model.Role;
import ir.headphone.spi.user.model.Rule;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.spi.user.service.TokenService;
import ir.headphone.users.error.AccessDenied;
import org.apache.logging.log4j.Logger;
import org.elasticsearch.common.regex.Regex;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SecurityService {
    private static final Logger LOGGER = ir.headphone.rest.logger.Logger.getInstance();
    private final AdminService adminService;
    private final TokenService tokenService;

    public SecurityService(AdminService adminService, TokenService tokenService) {
        this.adminService = adminService;
        this.tokenService = tokenService;
    }

    public boolean hasPermission(String token, String method, String path) {
//        if (!path.startsWith("/api/v1/admin") || method.equals("OPTIONS")) {
//            return true;
//        }
//        Map<String, String> data = tokenService.getTokenData(token);
//        String rl = data.get("rl");
//        if (rl == null) {
//            throw new AccessDenied("forbidden");
//        }
//        String[] roles = rl.split(",");
//        for (String roleId : roles) {
//            try {
//                Role role = adminService.getRole(roleId);
//                for (String ruleId : role.getRules()) {
//                    try {
//                        Rule rule = adminService.getRule(ruleId);
//                        if (matchRule(rule, method, path)) {
//                            return true;
//                        }
//                    } catch (Exception ignored) {
//                    }
//                }
//            } catch (Exception ignored) {
//            }
//        }
//        LOGGER.info(String.format("blocked request %s:%s", method, path));
//        throw new AccessDenied("forbidden");
        return true;
    }

    private boolean matchRule(Rule rule, String method, String path) {
        return Regex.simpleMatch(rule.getMethod(), method) && Regex.simpleMatch(rule.getPath(), path);
    }
}
