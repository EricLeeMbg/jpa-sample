package com.example.domain;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * Created by doohwan.yoo on 2017. 5. 28..
 */
@Entity
@Table(name = "tbl_user")
public class User extends BaseUser{

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "user_no", updatable = false, insertable = false)
    private Integer userNo;

    @Column(name = "user_name")
    private String userName;

    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @OneToOne(fetch = FetchType.LAZY, cascade={CascadeType.ALL})
//    @OneToOne(cascade={CascadeType.ALL})
    @JoinColumn(name="user_no", insertable = false)
    private UserExtra userExtra;

    public UserExtra getUserExtra() {
        return userExtra;
    }

    public void setUserExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
    }
}
