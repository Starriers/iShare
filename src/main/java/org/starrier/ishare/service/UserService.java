package org.starrier.ishare.service;

import org.starrier.ishare.model.entity.User;

import java.util.List;

/**
 * @author Starrier
 * @date 2019/4/14
 */
public interface UserService {

    /**
     * check user login
     *
     * @param username username
     * @param password password
     * @return {@link User}
     */
    User checkLogin(String username, String password);

    /**
     * register {@link User}
     *
     * @param user user entity
     */
    void register(User user);

    /**
     * checkout user isexist.
     *
     * @param username username
     * @return String
     */
    String isExist(String username);

    /**
     * Get users.
     *
     * @return List of {@link User}
     */
    List<User> findAllUser();

    /**
     * Get User By username.
     *
     * @param username username
     * @return {@link User} of list.
     */
    List<User> findByUsername(String username);

    /**
     * Add user
     *
     * @param user user entity
     */
    void addUser(User user);

    /**
     * update user.
     *
     * @param user user entity
     */
    void updateUser(User user);

    /**
     * Delete user by user's id
     *
     * @param id {@link User#getId()}
     */
    void deleteUserById(int id);
}
