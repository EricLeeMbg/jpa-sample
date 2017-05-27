package com.example.domain;

import javax.persistence.*;

/**
 * Created by doohwan.yoo on 2017. 5. 28..
 */
@Entity
@Table(name = "tbl_user_extra")
public class UserExtra {

    @Id
    @Column(name = "user_no")
    private Integer userNo;

    @Column(name = "phone_num")
    private String phoneNum;


    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }
}
