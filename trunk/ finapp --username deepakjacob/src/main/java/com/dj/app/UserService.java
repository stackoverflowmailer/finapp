package com.dj.app;

import com.dj.app.domain.User;

import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: Porus
 * Date: Jul 27, 2008
 * Time: 2:28:26 PM
 * To change this template use File | Settings | File Templates.
 */
public interface UserService {
    public User checkUserCredentials(User user) throws NoSuchUserException;

}
