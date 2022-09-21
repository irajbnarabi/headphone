package ir.headphone.payment.service.impl;

import ir.headphone.payment.model.IpgEntity;
import ir.headphone.spi.payment.model.Ipg;
import ir.headphone.spi.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public class DefaultPaymentService implements PaymentService {
    @Value("${rest.backend}")
    private String backend;

    @Override
    public String redirect(String referId, Integer ipg, Long amount) {
        return String.format("%s/api/v1/payment/redirect/%s/%s", backend, ipg, referId);
    }

    @Override
    public List<Ipg> getIpgs() {
        return List.of(
                IpgEntity.builder()
                        .id("1")
                        .name("بانک ملت")
                        .image("https://static.vidosign.com/files/6333d34229c95eb0ed93aa439f844e98.jpeg")
                        .build(),
                IpgEntity.builder()
                        .id("2")
                        .name("بانک سامان")
                        .image("https://static.vidosign.com/files/72bd165c1bac5c0d276c84e32c4772be.png")
                        .build()
        );
    }
}
