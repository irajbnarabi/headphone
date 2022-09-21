package ir.headphone.rest.config;

import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

public class CustomizedLocaleResolver extends AcceptHeaderLocaleResolver {
    @Override
    public Locale resolveLocale(HttpServletRequest request) {
        /*
          The locale can set via query param or http header. Query param is preferred rather than header.
          The query param's key should be 'locale'
          and the header's key should be 'User-Locale'
          which are specified by language tag (e.g. 'fa' for Persian or 'en' for English)
         */
        String localeParameter = request.getParameter("locale");
        if (localeParameter != null) {
            try {
                return Locale.forLanguageTag(localeParameter);
            } catch (Exception ex) {
                return getDefaultLocale();
            }
        }
        String customizedLocaleHeader = request.getHeader("User-Locale");
        if (customizedLocaleHeader != null) {
            try {
                return Locale.forLanguageTag(customizedLocaleHeader);
            } catch (Exception ex) {
                return getDefaultLocale();
            }
        }
        return getDefaultLocale();
    }

    @Override
    public void setLocale(HttpServletRequest request, HttpServletResponse response, Locale locale) {
    }
}
