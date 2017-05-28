package com.example.repository;

import com.example.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Created by doohwan.yoo on 2017. 5. 29..
 */
public interface UserRepositoryCustom {

    UserDTO getUserByQuerydsl(Integer id);
    Page<UserDTO> getUserList(Pageable pageable);
}
