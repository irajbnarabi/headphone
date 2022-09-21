package ir.headphone.rest.controller;

import ir.headphone.rest.model.ServiceResult;
import ir.headphone.rest.service.impl.DefaultContextHolder;
import ir.headphone.spi.user.service.ContextHolder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@ControllerAdvice
public class ResponseAdvice implements ResponseBodyAdvice<Object> {
    private final ContextHolder contextHolder;

    public ResponseAdvice(ContextHolder contextHolder) {
        this.contextHolder = contextHolder;
    }

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        return converterType.isAssignableFrom(MappingJackson2HttpMessageConverter.class);
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,
                                  ServerHttpResponse response) {
        if (request.getURI().getPath().startsWith("/api/v1")) {
            body = body instanceof ServiceResult ? body : new ServiceResult(body);
            if (DefaultContextHolder.getInstance().pageCount() != null) {
                ((ServiceResult) body).addMetadataItem("pageCount", DefaultContextHolder.getInstance().pageCount());
            }
            return body;
        }
        if (StringUtils.isNotBlank(contextHolder.newUserToken())) {
            response.getHeaders().add("X-User-Token", contextHolder.newUserToken());
        }
        return body;
    }


}
