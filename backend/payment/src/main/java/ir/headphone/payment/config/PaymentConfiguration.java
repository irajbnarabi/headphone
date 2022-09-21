package ir.headphone.payment.config;

import ir.headphone.payment.service.impl.DefaultPaymentService;
import ir.headphone.spi.payment.service.PaymentService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentConfiguration {
    @Bean
    public PaymentService paymentService() {
        return new DefaultPaymentService();
    }
}
