package ir.headphone.payment.service.impl;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.BasicHttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.ByteArrayInputStream;
import java.io.IOException;

public class PaystarIpg extends AbstractIpg {
    private static final String baseAddress = "http://core.paystar.ir/api/pardakht";
    private static final String terminalId = "";
    private static final String callback = "https://payment.vod.ir/v1/payment/";

    public String generatePaymentLink(Long amount, String orderId, String description) throws IOException {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost post = new HttpPost(baseAddress + "/create");
        post.addHeader("Authorization", "Bearer " + terminalId);
        String template = "{\"amount\":%d,\"order_id\":\"%s\",\"callback\":\"%s\",\"description\":\"%s\"}";

        BasicHttpEntity entity = new BasicHttpEntity();
        entity.setContent(new ByteArrayInputStream(String.format(template, amount, orderId, callback + orderId, description).getBytes()));
        post.setEntity(entity);
        CloseableHttpResponse response = httpclient.execute(post);
        return response.getEntity().getContent().toString();//TODO
    }
}
