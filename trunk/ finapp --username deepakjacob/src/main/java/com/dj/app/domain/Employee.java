package com.dj.app.domain;

import java.math.BigDecimal;

/**
 * 
 * @version $Id$
 */
public class Employee {
	private Long id;

	private String firstName;

	private String lastName;

	private BigDecimal salary;

	private String emailAddress;

	public Employee() {

	}

	public Employee(final Long id, final String firstName,
			final String lastName, final BigDecimal salary) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.salary = salary;
	}

	public String getEmailAddress() {
		return this.emailAddress;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public Long getId() {
		return this.id;
	}

	public String getLastName() {
		return this.lastName;
	}

	public BigDecimal getSalary() {
		return this.salary;
	}

	public void setEmailAddress(final String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public void setFirstName(final String firstName) {
		this.firstName = firstName;
	}

	public void setId(final Long id) {
		this.id = id;
	}

	public void setLastName(final String lastName) {
		this.lastName = lastName;
	}

	public void setSalary(final BigDecimal salary) {
		this.salary = salary;
	}

	@Override
	public String toString() {
		return "Employee{" + "id=" + this.id + ", firstName='" + this.firstName
				+ '\'' + ", lastName='" + this.lastName + '\'' + ", salary="
				+ this.salary + ", emailAddress='" + this.emailAddress + '\''
				+ '}';
	}
}
