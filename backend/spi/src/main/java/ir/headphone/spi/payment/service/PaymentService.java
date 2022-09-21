package ir.headphone.spi.payment.service;

import ir.headphone.spi.payment.model.Ipg;

import java.util.List;

public interface PaymentService {
    String redirect(String referId, Integer ipg, Long amount);

    List<Ipg> getIpgs();
}
