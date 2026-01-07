package org.starrier.ishare.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.starrier.ishare.dao.UserDao;
import org.starrier.ishare.model.entity.User;
import org.starrier.ishare.service.UserService;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * @author Starrier
 * @date 2019/4/11
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;

    @Autowired
    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * check login info.
     *
     * @param username username
     * @param password password
     * @return {@link User}
     */
    @Override
    public User checkLogin(String username, String password) {
        User user = userDao.findByUsername(username);
        return user != null && user.getPassword().equals(password) ? user : null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(User user) {
        userDao.registerByUsernameAndPassword(user.getUsername(), user.getPassword());
    }

    @Override
    public String isExist(String username) {
        User user = userDao.findByUsername(username);
        return null != user ? username : null;
    }

    @Override
    public List<User> findAllUser() {
        return userDao.showUser();
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUserById(int id) {
        userDao.delete(id);
    }

    @Override
    public List<User> findByUsername(String username) {
        return userDao.getUserByUsername(username);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addUser(User user) {
        userDao.addUser(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUser(User user) {
        userDao.updateUser(user);
    }


}
