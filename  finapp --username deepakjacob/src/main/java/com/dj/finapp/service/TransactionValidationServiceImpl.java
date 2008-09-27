package com.dj.finapp.service;

import com.dj.finapp.domain.Account;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Provides validation services on an account. Ideally this class's methods should be
 * invoked from  interceptors so that other modifications won't impact validation services.
 *
 * @author Porus
 */
public class TransactionValidationServiceImpl implements TransactionValidationService {

    private static final Log logger = LogFactory.getLog(TransactionValidationServiceImpl.class);
    /**
     * @see com.dj.finapp.service.TransactionValidationService's isAccountValid(Account) method.
     */
    public boolean isAccountValid(Account account) throws InvalidAccountException {
        if (logger.isDebugEnabled()) {
            logger.debug("isAccountValid(Account) - Account account=" + account);
        }
        return account.checkValidity();
    }
}
