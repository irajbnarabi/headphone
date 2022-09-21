package ir.headphone.spi.user.service;

import ir.headphone.spi.model.PageSize;

public interface ContextHolder {
    void update(Object request);

    String userToken();

    String newUserToken();

    void setNewUserToken(String userToken);

    String ip();

    PageSize pageSize();

    String device();

    String os();
}
