package com.dj.app.domain;

import java.io.Serializable;
import java.util.Map;

/**
 * @author Porus
 * @date Aug 1, 2008
 */
public class EXTFormSubmitResponse implements Response, Serializable {

    private static final long serialVersionUID = -5361156154460138626L;
    private Object data;
    private Map<String, String> errors;
    private boolean success;
    private String message;

    public EXTFormSubmitResponse() {
    }

    public EXTFormSubmitResponse(Object data, Map<String, String> errors, boolean success, String message) {
	this.data = data;
	this.errors = errors;
	this.success = success;
	this.message = message;
    }

    public Object getData() {
	return data;
    }

    public void setData(Object data) {
	this.data = data;
    }

    public Map<String, String> getErrors() {
	return errors;
    }

    public void setErrors(Map<String, String> errors) {
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
