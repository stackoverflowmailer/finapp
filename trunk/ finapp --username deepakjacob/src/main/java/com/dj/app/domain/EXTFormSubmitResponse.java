package com.dj.app.domain;

import java.util.List;
import java.util.Map;
import java.io.Serializable;

/**
 * User: Porus
 * Date: Aug 1, 2008
 */
public class EXTFormSubmitResponse implements Response, Serializable {
    private Object data;
    private Map errors;
    private boolean success;
    private String message;

    public EXTFormSubmitResponse() {
    }

    public EXTFormSubmitResponse(Object data, Map errors, boolean sucess, String message) {
        this.data = data;
        this.errors = errors;
        this.success = sucess;
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Map getErrors() {
        return errors;
    }

    public void setErrors(Map errors) {
        this.errors = errors;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
