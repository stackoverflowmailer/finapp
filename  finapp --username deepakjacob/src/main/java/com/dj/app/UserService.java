package com.dj.app;

import com.dj.app.domain.User;
import com.dj.app.domain.Response;
import com.dj.app.domain.EXTFormSubmitResponse;

import java.util.Map;
import java.util.HashMap;

/**
 * Created by IntelliJ IDEA.
 * User: Porus
 * Date: Jul 27, 2008
 * Time: 2:28:26 PM
 * To change this template use File | Settings | File Templates.
 */
public interface UserService {
    public Response checkUserCredentials(User user) throws NoSuchUserException;

}
