package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

import java.math.BigDecimal;
import java.util.Currency;

public interface Wallet extends Entity {
    String getUserId();

    Currency getCurrency();

    BigDecimal getAmount();
}
