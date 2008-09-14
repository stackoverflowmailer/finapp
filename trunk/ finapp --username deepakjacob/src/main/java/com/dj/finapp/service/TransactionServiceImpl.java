package com.dj.finapp.service;

import java.math.BigDecimal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.dj.finapp.domain.Account;
import com.dj.finapp.domain.Transaction;
import com.dj.finapp.domain.TransactionType;

public class TransactionServiceImpl implements TransactionService {

    /** Logger for this class */
    private static final Log logger = LogFactory.getLog(TransactionServiceImpl.class);
    
    
    
    public Account credit(Account account, BigDecimal amount) throws InvalidAccountException {
	account.credit(amount);
	if (logger.isInfoEnabled()) {
	    logger.info("credit(Account, BigDecimal) - Account account=" + account); //$NON-NLS-1$
	}
	
	save(account);
	return account;
    }

    // TODO: This methos has be moved from here to a generic method
    /**
     *Saves an entity.
     * 
     * @param account
     *            the account to be saved.
     */
    public void save(Account account) {
	if (logger.isInfoEnabled()) {
	    logger.info("save(Account) - start"); //$NON-NLS-1$
	}
    }

    public Account debit(Account account, BigDecimal amount) throws InvalidAccountException, NotEnoughMinimumBalanceException {
	account.debit(amount);
	if (logger.isInfoEnabled()) {
	    logger.info("debit(Account, BigDecimal) - Account account=" + account); //$NON-NLS-1$
	}
	save(account);
	return account;
    }

    

}
