package com.dj.app;

import com.dj.app.domain.User;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;

/**
 * Created by IntelliJ IDEA.
 * User: Porus
 * Date: Jul 27, 2008
 * Time: 2:31:32 PM
 * To change this template use File | Settings | File Templates.
 */
public class UserServiceImpl implements UserService {
    public User checkUserCredentials(User user) throws NoSuchUserException {
        if(user.getUserName().equals("deepakjacob")&& user.getPassword().equals("password")){
            User returnValue = new User((long) 1, "DJ", new Date(), new Date(), false);
            System.out.println("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            System.out.println("User ; " + returnValue);
            System.out.println("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            return user;
        }
           throw new NoSuchUserException("No user found : " + user.getUserName());
    }

}
