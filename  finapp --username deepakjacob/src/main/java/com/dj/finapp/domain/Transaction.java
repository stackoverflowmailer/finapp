package com.dj.finapp.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Transaction {
    @Id
    private Long id;
    @Column(name = "TXN_DATE")
    private Date date;
    @Column(name = "TXN_TYPE")
    private TransactionType type;
    @Column(name = "BALANCE_AFTER_TXN")
    private BigDecimal balance;
    @Column(name = "TXN_REFERENCE")
    private String reference;

    public Long getId() {
	return id;
    }

    public void setId(Long id) {
	this.id = id;
    }

    public Date getDate() {
	return date;
    }

    public void setDate(Date date) {
	this.date = date;
    }

    public TransactionType getType() {
	return type;
    }

    public void setType(TransactionType type) {
	this.type = type;
    }

    public BigDecimal getBalance() {
	return balance;
    }

    public void setBalance(BigDecimal balance) {
	this.balance = balance;
    }

    public String getReference() {
	return reference;
    }

    public void setReference(String reference) {
	this.reference = reference;
    }

}
