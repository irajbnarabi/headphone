package ir.headphone.rest.logger;

import org.apache.logging.log4j.Level;
import org.apache.logging.log4j.LogManager;

public final class Logger {

    private Logger() {
    }

    public static org.apache.logging.log4j.Logger getInstance() {
        return getInstance(Logger.class);
    }

    public static org.apache.logging.log4j.Logger getInstance(Class clazz) {
        return LogManager.getLogger(clazz);
    }
}
