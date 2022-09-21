package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.DiscountEntity;
import ir.headphone.users.model.entity.QDiscountEntity;
import ir.headphone.users.repository.DiscountRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import java.util.List;

public class DefaultDiscountRepository extends AbstractMongodbRepository<DiscountEntity> implements DiscountRepository {
    private static final QDiscountEntity q = QDiscountEntity.discountEntity;

    public DefaultDiscountRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, DiscountEntity.class);
    }

    @Override
    public DiscountEntity findByVoucher(String voucher) {
        return dsl()
                .where(q.voucher.eq(voucher), q.enabled.eq(true))
                .fetchOne();
    }

    @Override
    public List<DiscountEntity> findAllByVoucherPrefix(String voucher, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.voucher.startsWithIgnoreCase(voucher))
                .fetch();
    }
}
