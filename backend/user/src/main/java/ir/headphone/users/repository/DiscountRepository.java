package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.DiscountEntity;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface DiscountRepository extends Repository<DiscountEntity> {
    DiscountEntity findByVoucher(String voucher);

    List<DiscountEntity> findAllByVoucherPrefix(String voucher, PageRequest pageRequest);
}
