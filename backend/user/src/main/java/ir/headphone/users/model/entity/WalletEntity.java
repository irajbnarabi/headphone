package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.Wallet;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.Currency;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@Document(collection = "wallets")
public class WalletEntity extends AbstractEntity implements Wallet {
    @Indexed(unique = true)
    private String userId;
    private Currency currency;
    private BigDecimal amount;

    public WalletEntity() {
    }

    public WalletEntity(Wallet wallet) {
        super(wallet);
        this.userId = wallet.getUserId();
        this.currency = wallet.getCurrency();
        this.amount = wallet.getAmount();
    }
}
