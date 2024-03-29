package com.dj.finapp.service;

import com.dj.finapp.domain.Account;
import com.dj.finapp.domain.Transaction;
import com.dj.finapp.domain.TransactionType;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.math.BigDecimal;

public class TransactionServiceImpl implements TransactionService {

    /**
     * Logger for this class
     */
    private static final Log logger = LogFactory.getLog(TransactionServiceImpl.class);


    public Account findAccount(String accountNumber) throws NoAccountFoundException {
        return null;  
    }

    public Account credit(Account account, BigDecimal amount) throws InvalidAccountException {
        account.credit(amount);
        if (logger.isInfoEnabled()) {
            logger.info("credit(Account, BigDecimal) - Account account=" + account); //$NON-NLS-1$
        }

        save(account);
        return account;
    }

    /**
     * Saves an entity.
     * TODO: Move to a generic method
     *
     * @param account the account to be saved.
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

    public Transaction createTransactionEntry(Account account, TransactionType transactionType) throws InvalidAccountException {
        return account.createTransactionRecord(transactionType);
    }

    public BigDecimal getAccountBalance(Account account) throws InvalidAccountException {
        return account.getBalance();
    }


}
