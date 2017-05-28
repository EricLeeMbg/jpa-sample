package com.example.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUserExtra is a Querydsl query type for UserExtra
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUserExtra extends EntityPathBase<UserExtra> {

    private static final long serialVersionUID = 1701277196L;

    public static final QUserExtra userExtra = new QUserExtra("userExtra");

    public final StringPath phoneNum = createString("phoneNum");

    public final NumberPath<Integer> userNo = createNumber("userNo", Integer.class);

    public QUserExtra(String variable) {
        super(UserExtra.class, forVariable(variable));
    }

    public QUserExtra(Path<? extends UserExtra> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUserExtra(PathMetadata metadata) {
        super(UserExtra.class, metadata);
    }

}

