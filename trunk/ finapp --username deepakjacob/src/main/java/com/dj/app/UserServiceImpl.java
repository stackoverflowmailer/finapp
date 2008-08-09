package com.dj.app;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.dj.app.domain.EXTFormSubmitResponse;
import com.dj.app.domain.Response;
import com.dj.app.domain.User;

/**
 * @author Porus
 * @date Jul 27, 2008
 */
public class UserServiceImpl implements UserService {
    public Response checkUserCredentials(User user) throws NoSuchUserException {
	EXTFormSubmitResponse response = null;
	if (user.getUsername().equals("dj") && user.getPassword().equals("p")) {
	    User userFound = new User((long) 1, "DJ", new Date(), new Date(), false);
	    response = new EXTFormSubmitResponse(userFound, null, true, "");
	} else {
	    Map<String, String> errors = new HashMap<String, String>();
	    errors.put("username", "Invalid username");
	    errors.put("password", "Invalid password");
	    response = new EXTFormSubmitResponse(null, errors, false, "Please correct validation errors");
	}
	return response;
    }
}
