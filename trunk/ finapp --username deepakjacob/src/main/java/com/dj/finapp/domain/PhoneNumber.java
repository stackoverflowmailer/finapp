package com.dj.finapp.domain;

import javax.persistence.Embeddable;
import javax.persistence.Column;

@Embeddable
public class PhoneNumber {
    @Column(name="COUNTRY_CODE")
	private String countryCode;
    @Column(name="STATE_CODE")
	private String stateCode;
    @Column(name="PHONE_NO")
	private String telNo;

    public PhoneNumber() {
    }

    public PhoneNumber(String countryCode, String stateCode, String telNo) {
        this.countryCode = countryCode;
        this.stateCode = stateCode;
        this.telNo = telNo;
    }

    public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getStateCode() {
		return stateCode;
	}

	public void setStateCode(String stateCode) {
		this.stateCode = stateCode;
	}

	public String getTelNo() {
		return telNo;
	}

	public void setTelNo(String telNo) {
		this.telNo = telNo;
	}

}
