package com.example.repository.impl;

import com.example.domain.QUser;
import com.example.domain.QUserExtra;
import com.example.domain.User;
import com.example.dto.UserDTO;
import com.example.repository.UserRepositoryCustom;
import com.querydsl.core.QueryResults;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QueryDslRepositorySupport;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Created by doohwan.yoo on 2017. 5. 29..
 */
@Repository
public class UserRepositoryImpl extends QueryDslRepositorySupport implements UserRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;

    public UserRepositoryImpl() {
        super(User.class);
    }

    @Override
    public UserDTO getUserByQuerydsl(Integer id) {

        JPAQueryFactory queryFactory = new JPAQueryFactory(this.getEntityManager());

        QUser user = QUser.user;
        QUserExtra extra = QUserExtra.userExtra;

        return queryFactory.select(Projections.constructor(UserDTO.class, user.userNo, user.userName,
                extra.phoneNum))
                .from(user)
                .innerJoin(user.userExtra, extra) // entity에서 관계를 맺은 조건으로 자동으로 on 절이 생성 됨
                .where(user.userNo.eq(id)).fetchOne();

    }

    @Override
    public Page<UserDTO> getUserList(Pageable pageable) {
        JPAQueryFactory queryFactory = new JPAQueryFactory(this.getEntityManager());

        QUser user = QUser.user;
        QUserExtra extra = QUserExtra.userExtra;

        QueryResults<UserDTO> result = queryFactory.select(Projections.constructor(UserDTO.class, user.userNo, user.userName,
                extra.phoneNum))
                .from(user)
                .innerJoin(user.userExtra, extra) // entity에서 관계를 맺은 조건으로 자동으로 on 절이 생성 됨
                .offset(pageable.getOffset()) // offset과
                .limit(pageable.getPageSize()) // Limit 을 지정할 수 있고
                .orderBy(user.userNo.desc()) // 정렬도 가능하다
                .fetchResults();

        return new PageImpl<>(result.getResults(), pageable, result.getTotal());
    }
}
