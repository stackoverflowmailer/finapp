package com.dj.finapp.service;

/**
 * @author Porus
 */
public class NoAccountFoundException extends Exception {
    private static final long serialVersionUID = 5128750477842339525L;

    private String accountNumber;

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public NoAccountFoundException(String accountNumber) {
        super(" No account found with account number : " + accountNumber);
        setAccountNumber(accountNumber);
   }
}
