package com.dj.app;

import com.dj.app.domain.Employee;

import java.util.List;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: Jacob
 * Date: Mar 14, 2008
 * Time: 11:21:29 PM
 * To change this template use File | Settings | File Templates.
 */
public interface EmployeeService {

    /**
     * Get all the employee from the persistant storage
     *
     * @return a list of all employees
     */
    public List<Employee> getAllEmployees();

    /**
     * Make employee persistant
     *
     * @param employee
     * @return true if employee object is persisted
     */
    public Map saveEmployee(Employee employee);
}
