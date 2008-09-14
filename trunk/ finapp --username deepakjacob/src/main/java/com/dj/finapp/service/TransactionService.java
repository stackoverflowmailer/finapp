package com.dj.finapp.service;

import java.math.BigDecimal;

import com.dj.finapp.domain.Account;
import com.dj.finapp.domain.Transaction;
import com.dj.finapp.domain.TransactionType;

public interface TransactionService {

    public Account credit(Account account, BigDecimal amount) throws InvalidAccountException;

    public Account debit(Account account, BigDecimal amount) throws InvalidAccountException, NotEnoughMinimumBalanceException;

}
