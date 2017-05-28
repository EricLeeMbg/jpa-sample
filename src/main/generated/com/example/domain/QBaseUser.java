package com.example.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseUser is a Querydsl query type for BaseUser
 */
@Generated("com.querydsl.codegen.SupertypeSerializer")
public class QBaseUser extends EntityPathBase<BaseUser> {

    private static final long serialVersionUID = 1371277909L;

    public static final QBaseUser baseUser = new QBaseUser("baseUser");

    public QBaseUser(String variable) {
        super(BaseUser.class, forVariable(variable));
    }

    public QBaseUser(Path<? extends BaseUser> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseUser(PathMetadata metadata) {
        super(BaseUser.class, metadata);
    }

}

