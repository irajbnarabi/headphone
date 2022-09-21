package ir.headphone.rest.config;

import ir.headphone.analytics.config.EnableAnalyticsConfiguration;
import ir.headphone.kvstore.config.EnableKeyValueStoreConfiguration;
import ir.headphone.payment.config.EnablePaymentConfiguration;
import ir.headphone.rest.controller.interceptor.ContextInterceptor;
import ir.headphone.rest.controller.interceptor.SecurityInterceptor;
import ir.headphone.rest.service.impl.DefaultContextHolder;
import ir.headphone.rest.service.impl.SecurityService;
import ir.headphone.search.config.EnableSearchConfiguration;
import ir.headphone.social.config.EnableSocialConfiguration;
import ir.headphone.users.config.EnableUserConfiguration;
import ir.headphone.videos.config.EnableVideoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Locale;
import java.util.Objects;

@Configuration
@EnableUserConfiguration
@EnableVideoConfiguration
@EnableSearchConfiguration
@EnablePaymentConfiguration
@EnableSocialConfiguration
@EnableAnalyticsConfiguration
@EnableKeyValueStoreConfiguration
@EnableAsync(proxyTargetClass = true)
public class RestConfiguration {
    private final SecurityService securityService;

    public RestConfiguration(SecurityService securityService) {
        this.securityService = securityService;
    }

    @Bean
    public WebMvcConfigurer mvcConfigurer(Environment environment) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(Objects.requireNonNull(environment.getProperty("rest.cors.allowed-origins")).split(","))
                        .allowedMethods(Objects.requireNonNull(environment.getProperty("rest.cors.allowed-methods")).split(","))
                        .allowedHeaders(Objects.requireNonNull(environment.getProperty("rest.cors.allowed-headers")).split(","))
                        .allowCredentials(false).maxAge(3600 * 24);
            }

            @Override
            public void addInterceptors(InterceptorRegistry registry) {
                registry.addInterceptor(new SecurityInterceptor(securityService)).addPathPatterns("/**").order(0);
                registry.addInterceptor(new ContextInterceptor(DefaultContextHolder.getInstance())).addPathPatterns("/api/**").order(1);
            }
        };
    }

    @Bean
    public LocaleResolver localeResolver() {
        CustomizedLocaleResolver localeResolver = new CustomizedLocaleResolver();
        localeResolver.setDefaultLocale(Locale.forLanguageTag("fa"));
        return localeResolver;
    }

}