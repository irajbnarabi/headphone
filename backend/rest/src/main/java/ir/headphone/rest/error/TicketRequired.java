package ir.headphone.rest.error;

import ir.headphone.spi.error.ServiceException;

public class TicketRequired extends ServiceException {

    public TicketRequired(Object data) {
        super(402);
        this.setData(data);
    }
}
