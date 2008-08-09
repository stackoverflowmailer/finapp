package com.dj.finapp.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;

@Embeddable
public class Address {
    @Column(name="DOOR_NO")
    private String doorNo;
    @Column(name="STREET_NAME")
	private String streetName;
    @Column(name="AVENUE")
	private String avenue;
    @Column(name="CITY")
	private String city;
    @Column(name="STATE")
	private String state;
    @Column(name="COUNTRY")
	private String country;
    @Column(name="PIN")
	private String pin;
    @Embedded
	private PhoneNumber landlineNo;
//    @Embedded
//	private PhoneNumber mobileNo;

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
/*
	public PhoneNumber getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(PhoneNumber mobileNo) {
		this.mobileNo = mobileNo;
	}
*/
}
