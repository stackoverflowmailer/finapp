package com.dj.finapp.domain;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Account {
    public enum AccountType {
        SAVINGS, CURRENT, OTHER;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column(name = "ACCOUNT_NUMBER")
    private String accountNumber;
    @Column(name = "OPEN_DATE")
    private Date openDate;
    @Column(name = "CLOSE_DATE")
    private Date closeDate;
    @Column(name = "ACTIVE")
    private boolean active;
    @Column(name="ACCOUNT_TYPE")
    private AccountType accountType;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "account")
    private List<AccountHolder> accountHolders;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Transaction> transactions;
    @Column(name = "ACCOUNT_BALANCE")
    private BigDecimal balance;

    public Account() {
    }

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
