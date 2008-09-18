package com.dj.finapp.service;

import com.dj.finapp.domain.Account;

/**
 * Provides validation services on an account. Ideally this class's methods may be
 * invoked from  interceptor's so that other modification won't impact validation services.
 *
 * @author Porus
 */
public class TransactionValidationServiceImpl implements TransactionValidationService {
    /**
     * @see com.dj.finapp.service.TransactionValidationService's isAccountValid(Account) method.
     */
    public boolean isAccountValid(Account account) throws InvalidAccountException {
        return account.checkValidity();
    }
}
