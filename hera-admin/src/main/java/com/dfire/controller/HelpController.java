package com.dfire.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * desc:
 *
 * @author scx
 * @create 2019/11/05
 */

@Controller
@RequestMapping("/help")

public class HelpController {

    @RequestMapping
    public String index() {
        return "help";
    }

}
