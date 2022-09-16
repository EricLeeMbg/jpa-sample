package com.example.dto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.Generated;

/**
 * com.example.dto.QUserDTO is a Querydsl Projection type for UserDTO
 */
@Generated("com.querydsl.codegen.ProjectionSerializer")
public class QUserDTO extends ConstructorExpression<UserDTO> {

    private static final long serialVersionUID = 600939124L;

    public QUserDTO(com.querydsl.core.types.Expression<Integer> userNo, com.querydsl.core.types.Expression<String> userName, com.querydsl.core.types.Expression<String> phoneNum) {
        super(UserDTO.class, new Class<?>[]{int.class, String.class, String.class}, userNo, userName, phoneNum);
    }

}

