package ir.headphone.spi.error;

public abstract class ServiceException extends RuntimeException {
    private int httpStatus = 500;
    private Object data;

    public ServiceException() {
    }

    public ServiceException(int httpStatus) {
        this.httpStatus = httpStatus;
    }

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(String message, int httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(int httpStatus) {
        this.httpStatus = httpStatus;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
