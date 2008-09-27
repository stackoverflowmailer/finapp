package com.dj.finapp.service;

import java.io.Serializable;

/**
 * Created by IntelliJ IDEA.
 * User: Porus
 * Date: Sep 18, 2008
 * Time: 11:18:27 PM
 * To change this template use File | Settings | File Templates.
 */
public interface GenericService<T, PK extends Serializable> {

    public T find(PK id);

    public T save(T t);

    public T update(T t);

    public T delete(T t);

}
