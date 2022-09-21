package ir.headphone.payment.model;

import ir.headphone.spi.payment.model.Ipg;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IpgEntity implements Ipg {
    private String id;
    private String name;
    private String image;
}
