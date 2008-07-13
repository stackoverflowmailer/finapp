package com.dj.finapp.domain;

public class Address {

	private Long id;

	private String doorNo;

	private String streetName;

	private String avenue;

	private String city;

	private String state;

	private String country;

	private String pin;

	private PhoneNumber landlineNo;

	private PhoneNumber mobileNo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDoorNo() {
		return doorNo;
	}

	public void setDoorNo(String doorNo) {
		this.doorNo = doorNo;
	}

	public String getStreetName() {
		return streetName;
	}

	public void setStreetName(String streetName) {
		this.streetName = streetName;
	}

	public String getAvenue() {
		return avenue;
	}

	public void setAvenue(String avenue) {
		this.avenue = avenue;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getPin() {
		return pin;
	}

	public void setPin(String pin) {
		this.pin = pin;
	}

	public PhoneNumber getLandlineNo() {
		return landlineNo;
	}

	public void setLandlineNo(PhoneNumber landlineNo) {
		this.landlineNo = landlineNo;
	}

	public PhoneNumber getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(PhoneNumber mobileNo) {
		this.mobileNo = mobileNo;
	}

}
