package com.dj.app;

import com.dj.app.domain.Response;
import com.dj.app.domain.User;

/**
 *@author Porus
 * @date Jul 27, 2008
 */
public interface UserService {
    public Response checkUserCredentials(User user) throws NoSuchUserException;

}
