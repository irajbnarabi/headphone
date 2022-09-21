package ir.headphone.rest.i18n;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class Internationalization {
    private final ReloadableResourceBundleMessageSource messageSource;


    public Internationalization() {
        this.messageSource = getMessageSourceInstance();
        LocaleContextHolder.setDefaultLocale(Locale.forLanguageTag("fa_IR"));
    }

    private ReloadableResourceBundleMessageSource getMessageSourceInstance() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        String[] propertyFiles = {
                "classpath:/i18n/general"
        };

        messageSource.setBasenames(propertyFiles);
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setUseCodeAsDefaultMessage(true);
        return messageSource;
    }

    public MessageSource getMessageSource() {
        return messageSource;
    }


    public String getMessage(String code) {
        return messageSource.getMessage(code, null, LocaleContextHolder.getLocale());
    }

    public String getMessage(String code, Object[] args) {
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }

    public String getMessage(String code, String defaultMessage) {
        return messageSource.getMessage(code, null, defaultMessage, LocaleContextHolder.getLocale());
    }

    public String getMessage(String code, String defaultMessage, Object[] args) {
        return messageSource.getMessage(code, args, defaultMessage, LocaleContextHolder.getLocale());
    }

}
