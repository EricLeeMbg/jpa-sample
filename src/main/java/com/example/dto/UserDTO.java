package com.example.dto;

import com.querydsl.core.annotations.QueryProjection;

import java.io.Serializable;

/**
 * Created by doohwan.yoo on 2017. 5. 29..
 */
public class UserDTO implements Serializable {

    private static final long serialVersionUID = -3777937207533558441L;

    private Integer userNo;
    private String userName;
    private String phoneNum;

    @QueryProjection
    public UserDTO(Integer userNo, String userName, String phoneNum) {
        this.userNo = userNo;
        this.userName = userName;
        this.phoneNum = phoneNum;
    }

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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
