package com.dj.app;

import com.dj.app.domain.User;
import com.dj.app.domain.EXTFormSubmitResponse;
import com.dj.app.domain.Response;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;

//import flexjson.JSONSerializer;

/**
 * Created by IntelliJ IDEA.
 * User: Porus
 * Date: Jul 27, 2008
 * Time: 2:31:32 PM
 */
public class UserServiceImpl implements UserService {
    public Response checkUserCredentials(User user) throws NoSuchUserException {
        EXTFormSubmitResponse response = null;
        if (user.getUsername().equals("dj") && user.getPassword().equals("p")) {
            User userFound = new User((long) 1, "DJ", new Date(), new Date(), false);
            response = new EXTFormSubmitResponse(
                    user,  null,true, ""
            );

        } else {
            Map errors = new HashMap ();
            errors.put("username", "Invalid username");
            errors.put("password", "Invalid password");

            response = new EXTFormSubmitResponse(null,  errors, false, "Please correct validation errors");
        }

        //System.out.println("JSON : " + new JSONSerializer().serialize(response));

       return response;
    }
}
