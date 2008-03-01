package com.dj.mvc;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@org.springframework.stereotype.Controller

@RequestMapping("/requestmapping.html")
public class RequestMappingController implements org.springframework.web.servlet.mvc.Controller {

    public ModelAndView handleRequest(HttpServletRequest arg0, HttpServletResponse arg1) throws Exception {
        System.out.println("Controller was found using the Request Mapping annotation");
        return new ModelAndView();
    }

}
