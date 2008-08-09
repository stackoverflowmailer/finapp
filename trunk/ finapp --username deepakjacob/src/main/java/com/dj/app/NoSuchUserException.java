package com.dj.app;

/**
 * @author Porus
 * @date Jul 27, 2008
 */
public class NoSuchUserException extends Throwable {

    private static final long serialVersionUID = 7090163132362124066L;
    
    public NoSuchUserException(String message) {
	super(message);
    }
}
