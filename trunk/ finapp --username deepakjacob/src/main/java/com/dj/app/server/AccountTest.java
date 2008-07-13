package com.dj.app.server;

import com.dj.finapp.domain.Account;
import com.dj.finapp.domain.AccountHolder;
import com.dj.finapp.domain.Address;
import com.dj.finapp.domain.PhoneNumber;

import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityManager;
import javax.persistence.Persistence;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

/**
 * Created by IntelliJ IDEA.
 * User: Jacob
 * Date: Jul 13, 2008
 * Time: 1:38:15 PM
 * To change this template use File | Settings | File Templates.
 */
public class AccountTest {

    private EntityManagerFactory emf;
    private EntityManager em;


    AccountTest() {
        final Account account = new Account();
        account.setId(new Long(1000));
        account.setAccountType(Account.AccountType.SAVINGS);
        account.setBalance(new BigDecimal("1000.00"));
        account.setCloseDate(new Date());
        account.setOpenDate(new Date());

        AccountHolder accountHolder = new AccountHolder();
        accountHolder.setFirstName("Deepak");
        accountHolder.setLastName("Jacob");


        Address permAddress = new Address();
        PhoneNumber homePhone = new PhoneNumber("91", "481", "2509329");
        permAddress.setLandlineNo(homePhone);
        permAddress.setDoorNo("Karingnamattom House");
        permAddress.setState("Kerala");
        permAddress.setCountry("India");

        accountHolder.setAddress1(permAddress);
        accountHolder.setAccount(account);


        List<AccountHolder> accountHolderList = new ArrayList<AccountHolder>(10);
        AccountHolder accountHolder2 = new AccountHolder();
        accountHolder2.setFirstName("Renjith");
        accountHolder2.setLastName("Kurian");
        accountHolder2.setAccount(account);
        accountHolderList.add(accountHolder);
        accountHolderList.add(accountHolder2);
        account.setAccountHolders(accountHolderList);


        emf = Persistence.createEntityManagerFactory("finappPU");
        em = emf.createEntityManager();

        em.getTransaction().begin();
        em.merge(account);
        em.getTransaction().commit();

    }


    public static void main(String[] args) {
        AccountTest test = new AccountTest();

    }
}
