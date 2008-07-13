package com.dj.finapp.domain;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class Account {

	private Long id;

	private String accountNumber;

	private Date openDate;

	private Date closeDate;

	private boolean active;

	private AccountType accountType;

	private List<AccountHolder> accountHolders;

	private List<Transaction> transactions;

	private BigDecimal balance;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getOpenDate() {
		return openDate;
	}

	public void setOpenDate(Date openDate) {
		this.openDate = openDate;
	}

	public Date getCloseDate() {
		return closeDate;
	}

	public void setCloseDate(Date closeDate) {
		this.closeDate = closeDate;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public AccountType getAccountType() {
		return accountType;
	}

	public void setAccountType(AccountType accountType) {
		this.accountType = accountType;
	}

	public List<AccountHolder> getAccountHolders() {
		return accountHolders;
	}

	public void setAccountHolders(List<AccountHolder> accountHolders) {
		this.accountHolders = accountHolders;
	}

	public List<Transaction> getTransactions() {
		return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
		this.transactions = transactions;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

}
