package ir.headphone.users.model;

import org.springframework.util.Assert;

import java.util.Date;

public class Token {
    private final String key;
    private final long keyCreationTime;
    private final String extendedInformation;

    public Token(String key, long keyCreationTime, String extendedInformation) {
        Assert.hasText(key, "Key required");
        Assert.notNull(extendedInformation, "Extended information cannot be null");
        this.key = key;
        this.keyCreationTime = keyCreationTime;
        this.extendedInformation = extendedInformation;
    }

    public String getKey() {
        return key;
    }

    public long getKeyCreationTime() {
        return keyCreationTime;
    }

    public String getExtendedInformation() {
        return extendedInformation;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Token) {
            Token rhs = (Token) obj;
            return this.key.equals(rhs.key)
                    && this.keyCreationTime == rhs.keyCreationTime
                    && this.extendedInformation.equals(rhs.extendedInformation);
        }
        return false;
    }

    @Override
    public int hashCode() {
        int code = 979;
        code = code * key.hashCode();
        code = code * Long.valueOf(keyCreationTime).hashCode();
        code = code * extendedInformation.hashCode();
        return code;
    }

    @Override
    public String toString() {
        return "DefaultToken[key=" + key + "; creation=" + new Date(keyCreationTime)
                + "; extended=" + extendedInformation + "]";
    }

}