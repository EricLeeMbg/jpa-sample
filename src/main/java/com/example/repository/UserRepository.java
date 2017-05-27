package com.example.repository;

import com.example.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by doohwan.yoo on 2017. 5. 28..
 */
public interface UserRepository extends JpaRepository<User, Integer> {

}
