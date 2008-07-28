package com.dj.app.domain;

import java.util.Date;

/**
 * Created by IntelliJ IDEA.
 * User: Porus
 * Date: Jul 27, 2008
 * Time: 2:29:48 PM
 * To change this template use File | Settings | File Templates.
 */
public class User {
    private Long id;
    private String userName;
    private String password;
    private Date joinDate;
    private Date lastAccessedDate;
    private boolean locked;

    public User() {
    }

    public User(Long id, String userName, Date joinDate, Date lastAccessedDate, boolean locked) {
        this.id = id;
        this.userName = userName;
        this.joinDate = joinDate;
        this.lastAccessedDate = lastAccessedDate;
        this.locked = locked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Date joinDate) {
        this.joinDate = joinDate;
    }

    public Date getLastAccessedDate() {
        return lastAccessedDate;
    }

    public void setLastAccessedDate(Date lastAccessedDate) {
        this.lastAccessedDate = lastAccessedDate;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }
}
