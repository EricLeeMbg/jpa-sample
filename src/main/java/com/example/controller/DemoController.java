package com.example.controller;

import com.example.domain.User;
import com.example.service.DemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by doohwan.yoo on 2017. 5. 15..
 */
@Controller
public class DemoController {

    private DemoService demoService;

    @Autowired
    public DemoController(DemoService demoService) {
        this.demoService = demoService;
    }

    @RequestMapping(value="/test", method = RequestMethod.POST)
    public @ResponseBody
    User test(@RequestBody User input) {

        return demoService.userSaveAndUpdate(input);
    }

    @RequestMapping(value="/user/{id}", method = RequestMethod.GET)
    public @ResponseBody
    User getUser(@PathVariable Integer id) {

        return demoService.getUser(id);
    }

}
