package com.dj.finapp.domain;

public class AccountHolder {

	private Long id;

	private boolean isMainAccountHolder = false;

	private String firstName;

	private String lastName;

	private Address address1;

	private Address address2;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public boolean isMainAccountHolder() {
		return isMainAccountHolder;
	}

	public void setMainAccountHolder(boolean isMainAccountHolder) {
		this.isMainAccountHolder = isMainAccountHolder;
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

	public Address getAddress1() {
		return address1;
	}

	public void setAddress1(Address address1) {
		this.address1 = address1;
	}

	public Address getAddress2() {
		return address2;
	}

	public void setAddress2(Address address2) {
		this.address2 = address2;
	}

}
