package com.dj.finapp.service;

public class InvalidAccountException extends Exception {
    private static final long serialVersionUID = 6390982588795778720L;

    public InvalidAccountException(String message) {
	super(message);
    }
}
