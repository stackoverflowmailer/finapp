package com.dj.app;

import com.dj.app.domain.Employee;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Porus
 * @date Mar 14, 2008
 */
public class EmployeeServiceImpl implements EmployeeService {

    private Log log = LogFactory.getLog(EmployeeServiceImpl.class);

    public List<Employee> getAllEmployees() {
        List<Employee> empList = new ArrayList<Employee>();
        // Add employees to the list
        empList.add(new Employee((long) 1, "Deepak", "Jacob", new BigDecimal("100000.33")));
        empList.add(new Employee((long) 2, "Pradeep", "K", new BigDecimal("10066600.33")));
        if (log.isDebugEnabled()) {
            log.debug(empList);
        }
        return empList;
    }

    public Map saveEmployee(Employee employee) {
        System.out.println("Employee : '" + employee);
        System.out.println("Employee Saved !");
        Map<String, Object> hashMap = new HashMap<String, Object>();
        hashMap.put("success", true);
        List list = new ArrayList();
        list.add("error2");
        hashMap.put("errors", list);
        return hashMap;
    }

    public List<Employee> getEmployeeWithName(String name) {
        Employee employee;
        List<Employee> empList = new ArrayList<Employee>();
        if (name.equals("Deepak")) {
            employee = new Employee((long) 1, "Deepak", "Jacob", new BigDecimal("100000.33"));
        } else {
            employee = new Employee((long) 2, "Maneesh", "Kumar", new BigDecimal("100000.33"));
        }
        empList.add(employee);
        return empList;
    }

    public Employee getEmployee(String name) {
        Employee employee;
        if (name.equals("Deepak")) {
            employee = new Employee((long) 1, "Deepak", "Jacob", new BigDecimal("100000.33"));
        } else {
            employee = new Employee((long) 2, "Mukesh", "Dubey", new BigDecimal("100000.33"));
        }
        return employee;
    }

}
