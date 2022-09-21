package ir.headphone.rest.controller;

import ir.headphone.rest.i18n.Internationalization;
import ir.headphone.rest.logger.Logger;
import ir.headphone.rest.model.ServiceResult;
import ir.headphone.spi.error.ServiceException;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@ControllerAdvice
public class ControllerAdvisor {
    private final Internationalization internationalization;
    private final Environment environment;

    public ControllerAdvisor(Internationalization internationalization, Environment environment) {
        this.internationalization = internationalization;
        this.environment = environment;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> processApiException(Exception e, HttpServletRequest request, HttpServletResponse response) throws Exception {
        String message;
        Integer status;
        Object data = null;

        if (e instanceof ServiceException) {
            status = ((ServiceException) e).getHttpStatus();
            data = ((ServiceException) e).getData();
            message = internationalization.getMessage(e.getClass().getCanonicalName(), e.getMessage());
        } else {
            boolean resolved = false;
            try {
                status = HttpStatus.valueOf(environment.getProperty("rest.exceptions." + e.getClass().getCanonicalName(),
                        Integer.class, HttpStatus.INTERNAL_SERVER_ERROR.value())).value();
                resolved = true;
            } catch (Exception ex) {
                status = HttpStatus.INTERNAL_SERVER_ERROR.value();
            }
            if (resolved) {
                message = internationalization.getMessage(e.getClass().getCanonicalName());
                if (message.equals(e.getClass().getCanonicalName())) {
                    message = e.getMessage();
                }
            } else {
                message = internationalization.getMessage(e.getClass().getCanonicalName(), internationalization.getMessage("status.500"));
            }
        }
        if (HttpStatus.valueOf(status).is5xxServerError()) {
            Logger.getInstance().error(ExceptionUtils.getStackTrace(e));
        }
        return new ResponseEntity<>(new ServiceResult(status, message, data), HttpStatus.valueOf(status));
    }
}