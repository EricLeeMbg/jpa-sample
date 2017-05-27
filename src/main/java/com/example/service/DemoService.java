package com.example.service;

import com.example.domain.User;
import com.example.repository.UserExtraRepository;
import com.example.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by doohwan.yoo on 2017. 5. 15..
 */
@Service
public class DemoService {

    private UserRepository userRepository;

    public DemoService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User userSaveAndUpdate(User input) {
        return userRepository.save(input);
    }

    public User getUser(Integer id) {
        return userRepository.findOne(id);
    }
}
