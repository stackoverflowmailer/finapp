package com.dj.finapp.service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;

/**
 * Defines generic CRUD services that can be invoked for any entities.
 */
public class GenericServiceImpl<T, PK extends Serializable> implements GenericService<T, PK> {

    @PersistenceContext
    private EntityManager entityManager;

    public T find(PK id) {
        return (T) entityManager.find(Object.class,id);
    }

    /**
     * Make this entity persistant.
     * 
     * @param t
     * @return
     */
    public void save(T t) {
        return;
    }

    public T update(T t) {
        return null;
    }

    public T delete(T t) {
        return null;
    }

}
