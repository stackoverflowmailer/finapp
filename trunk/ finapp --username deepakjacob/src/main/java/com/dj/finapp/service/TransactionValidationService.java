package com.dj.finapp.service;

import com.dj.finapp.domain.Account;

/**
 * Provides validation services on an account.  Ideally this class's methods may be
 * invoked from  interceptor's so that other modification won't impact validation services.
 *
 * @author Porus
 */
public interface TransactionValidationService {

    /**
     * Checks whether the provided account is valid or not. This method should be ideally
     * invoked before performing any other operation on the provided account.
     *
     * @param account the account to be checked for validity.
     * @return true if, the provided account is valid
     * @throws InvalidAccountException if no such account exists or if the provided account is not active.
     */
    public boolean isAccountValid(Account account) throws InvalidAccountException;

    //public boolean hasPermission(Account account, User user) throws InvalidAccountException
}
