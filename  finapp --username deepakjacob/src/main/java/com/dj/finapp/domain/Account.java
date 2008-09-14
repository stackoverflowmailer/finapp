package com.dj.finapp.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.dj.finapp.service.InvalidAccountException;
import com.dj.finapp.service.NotEnoughMinimumBalanceException;

@Entity
public class Account {

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
    @Column(name = "ACCOUNT_TYPE")
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
	return new Date(openDate.getTime());
    }

    public void setOpenDate(Date openDate) {
	this.openDate = openDate;
    }

    public Date getCloseDate() {
	return new Date(closeDate.getTime());
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
	return ((balance == null) ? new BigDecimal("0") : new BigDecimal(balance.toString()));
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

    public boolean checkValidity() throws InvalidAccountException {
	if (getId() == null || !(isActive())) {
	    throw new InvalidAccountException("Account id : '" + getId() + "' not exists or account not active: '" + isActive() + "'");
	}
	return true;
    }

    public void credit(BigDecimal amount) throws InvalidAccountException {
	checkValidity();
	BigDecimal currentBalance = getBalance();
	BigDecimal newBalance = currentBalance.add(amount);
	setBalance(newBalance);
	createTransactionRecord(TransactionType.CREDIT);
    }

    public void debit(BigDecimal amount) throws InvalidAccountException, NotEnoughMinimumBalanceException {
	checkValidity();
	ensureMinimumBalance(amount);
	BigDecimal currentBalance = getBalance();
	BigDecimal newBalance = currentBalance.subtract(amount);
	setBalance(newBalance);
	createTransactionRecord(TransactionType.DEBIT);
    }

    private void ensureMinimumBalance(BigDecimal amount) throws NotEnoughMinimumBalanceException {
	if (balance.compareTo(amount) < 0) {
	    throw new NotEnoughMinimumBalanceException("Not enough balance to withdraw amount : " + amount);
	}
    }

    public void setTransaction(Transaction transaction) {
	List<Transaction> transactions  = getTransactions();
	if(transactions == null) {
	    transactions = new ArrayList<Transaction>(10);
	}
	transactions.add(transaction);
    }

    /**
     * Called when performing any transaction on an account(e.g. credit, debit)
     * to store the details of the performed transaction for future reference.
     * 
     * @param transactionType
     *            the type of the transaction such credit or debit
     * @return the created transaction.
     * 
     * @throws InvalidAccountException if the provided account details are not valid. 
     */
    public Transaction createTransactionRecord(TransactionType transactionType) throws InvalidAccountException {
	checkValidity();
        Transaction transaction = new Transaction();
        transaction.setDate(new Date());
        transaction.setBalance(getBalance());
        transaction.setType(transactionType);
        transaction.setReference(getAccountNumber());
        setTransaction(transaction);
        return transaction;
    }

}
