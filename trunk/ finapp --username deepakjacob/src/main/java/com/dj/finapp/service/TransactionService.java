package com.dj.finapp.service;

import com.dj.finapp.domain.Account;
import com.dj.finapp.domain.Transaction;
import com.dj.finapp.domain.TransactionType;

import java.math.BigDecimal;


/**
 * Defines the operations that can be performed on an Account object.
 *
 * @author Porus
 */
public interface TransactionService {

    /**
     * Credit the provided amount to this account.
     *
     * @param account the account on which transaction is performed.
     * @param amount  the amount to be credited.
     * @return the account on which credit has been performed.
     * @throws InvalidAccountException if account is invalid orl
     *                                 not active.
     */
    public Account credit(Account account, BigDecimal amount) throws InvalidAccountException;

    /**
     * Debit the provided amount from this account.
     *
     * @param account the account on which transaction is performed.
     * @param amount  the amount to be debited.
     * @return the account on which debit has been performed.
     * @throws InvalidAccountException if account is invalid or not active.
     * @throws NotEnoughMinimumBalanceException
     *                                 if account is not having enough balance to perform debit.
     */
    public Account debit(Account account, BigDecimal amount) throws InvalidAccountException, NotEnoughMinimumBalanceException;

    /**
     * Persist details of the current transaction. For example
     * a transaction can be a credit, debit, checking account balance,
     * or credit transfer from an account.
     *
     * @param account         the account on which transaction is performed.
     * @param transactionType type of the transaction. Examples are credit, debit or checking balance.
     * @return a an instance of transaction which contains details of the operation just performed on the provided account.
     * @throws InvalidAccountException if account is invalid or not active.
     */
    public Transaction createTransactionEntry(Account account, TransactionType transactionType) throws InvalidAccountException;
}
