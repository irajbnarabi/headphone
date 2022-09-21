package ir.headphone.spi.user.service;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.Discount;

import java.util.Collection;

public interface DiscountService {
    Discount get(String id);

    Discount create(Discount discount);

    void delete(String id);

    Discount verify(String voucher, String planId, String userId);

    Collection<? extends Discount> getDiscounts(String voucher, PageSize pageSize);
}
