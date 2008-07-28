package com.dj.app;

/**
 * Created by IntelliJ IDEA.
 * User: Porus
 * Date: Jul 27, 2008
 * Time: 2:37:16 PM
 * To change this template use File | Settings | File Templates.
 */
public class NoSuchUserException extends Throwable {
    public NoSuchUserException(String message) {
        super(message);
    }
}
