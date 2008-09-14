package com.dj.finapp.service;

public class NotEnoughMinimumBalanceException extends Exception {
    private static final long serialVersionUID = -1124136022221174622L;
    
    public NotEnoughMinimumBalanceException(String message) {
	super(message);
    }
}
