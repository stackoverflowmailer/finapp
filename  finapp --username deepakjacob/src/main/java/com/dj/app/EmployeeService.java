package com.dj.app;

import com.dj.app.domain.Employee;

import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: Jacob
 * Date: Mar 14, 2008
 * Time: 11:21:29 PM
 * To change this template use File | Settings | File Templates.
 */
public interface EmployeeService {
    public List<Employee> getAllEmployees();
}
