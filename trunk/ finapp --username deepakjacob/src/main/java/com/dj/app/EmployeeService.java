package com.dj.app;

import java.util.List;
import java.util.Map;

import com.dj.app.domain.Employee;

/**
 * @author Porus
 * @date Mar 14, 2008
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
