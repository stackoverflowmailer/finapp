package com.dj.finapp.service;

/**
 * @author Porus
 */
public class NoAccountFoundException extends Exception {
    private String accountNumber;

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public NoAccountFoundException(String accountNumber) {
        super(" No account found with account number : " + accountNumber);
        setAccountNumber(accountNumber);
   }
}
