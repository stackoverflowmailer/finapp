package com.dj.app.domain;

import java.math.BigDecimal;

/**
 * Created by IntelliJ IDEA.
 * User: Jacob
 * Date: Mar 14, 2008
 * Time: 11:18:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class Employee {
    private Long id;

    private String firstName;

    private String lastName;

    private BigDecimal salary;

    public Employee() {

    }

    public Employee(Long id, String firstName, String lastName, BigDecimal salary) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.salary = salary;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }


}
