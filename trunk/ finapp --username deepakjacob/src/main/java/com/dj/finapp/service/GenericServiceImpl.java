package com.dj.finapp.service;

import java.io.Serializable;

/**
 * Defines generic CRUD services that can be invoked for any entities.
 */
public class GenericServiceImpl<T, PK extends Serializable> implements GenericService<T, PK> {

    public T find(PK id) {
        return null;
    }

    /**
     * Make this entity persistant.
     * 
     * @param t
     * @return
     */
    public T save(T t) {
        return null;
    }

    public T update(T t) {
        return null;
    }

    public T delete(T t) {
        return null;
    }

}
