package com.dj.app;

import com.dj.app.domain.Employee;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: Jacob
 * Date: Mar 14, 2008
 * Time: 11:16:21 PM
 * To change this template use File | Settings | File Templates.
 */
public class EmployeeServiceImpl implements EmployeeService {

    private Log log = LogFactory.getLog(EmployeeServiceImpl.class);


    public List<Employee> getAllEmployees() {
        List<Employee> empList = new ArrayList<Employee>();
        //Add employees to the list    
        empList.add(new Employee(new Long(1), "Deepak", "Jacob", new BigDecimal("100000.33")));
        empList.add(new Employee(new Long(2), "Mukesh", "Dubey", new BigDecimal("100000.33")));
        if (log.isDebugEnabled()) {
            log.debug(empList);
        }
        return empList;
    }
}
