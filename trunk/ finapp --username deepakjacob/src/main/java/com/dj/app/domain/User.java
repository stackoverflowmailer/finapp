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
    private String username;             
    private String password;
    private Date joinDate;
    private Date lastAccessDate;
    private boolean locked;

    public User() {
    }

    public User(Long id, String username, Date joinDate, Date lastAccessDate, boolean locked) {
        this.id = id;
        this.username = username;
        this.joinDate = joinDate;
        this.lastAccessDate = lastAccessDate;
        this.locked = locked;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Date getLastAccessDate() {
        return lastAccessDate;
    }

    public void setLastAccessDate(Date lastAccessDate) {
        this.lastAccessDate = lastAccessDate;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }
}
