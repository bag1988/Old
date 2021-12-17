var baglogin = {
    viewEmail: function (idProperty) {
        var viewContent = document.getElementById(idProperty + "_viewContent");
        viewContent.innerHTML = "";
        var div = document.createElement("div");
        div.setAttribute("class", "errormeessage");
        div.setAttribute("id", "errorlogin");
        viewContent.appendChild(div);

        div = document.createElement("div");
        var lab = document.createElement("label");
        lab.setAttribute("for", "email_text");
        lab.innerHTML = "Email";
        div.appendChild(lab);
        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "email_text");        
        div.appendChild(input);
        viewContent.appendChild(div);

        input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", "Отправить");
        input.setAttribute("onclick", "baglogin.sendEmail('" + idProperty + "');");
        viewContent.appendChild(input);

        input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", "Отмена");
        input.setAttribute("onclick", "bagcontrol.loadLoginBox('" + idProperty + "');");
        viewContent.appendChild(input);
    },
    sendEmail: function () {
        var email = document.getElementById("email_text").value;
        if (email != "") {
            document.getElementById("errorlogin").innerHTML = "<font style='color:green;'>Идет отправка</font>";
            bagrequest.sendEmail(email);
        }
    },

    endLoginUser: function(xmldoc,args)
    {
        if (xmldoc) {
            var root_node = xmldoc.querySelectorAll("message");
            if (root_node.length > 0) {
                if (document.getElementById("errorlogin")) {
                    document.getElementById("errorlogin").innerHTML = root_node[0].childNodes[0].nodeValue;
                }
            }
            else
                location.reload();
        }
    },
    loginUser: function()
    {
        var userName = document.getElementById("userName").value;
        var userPassword = document.getElementById("userPassword").value;
        if (userName != "" && userPassword != "") {
            var formData = new FormData();
            formData.append("userName", userName);
            formData.append("userPassword", userPassword);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/loginUser", baglogin.endLoginUser, null);
        }
        else {
            document.getElementById("errorlogin").innerHTML = "Недопустимое значение!";
        }
    },
    
    endCreateUserBox: function (xmldoc, args) {
        var viewContent = document.getElementById(args + "_viewContent");
        viewContent.innerHTML = "";
        if (xmldoc) {
            var root_node = xmldoc.querySelectorAll("levelMenu");
            if (root_node.length > 0) {                
                
                var div = document.createElement("div");
                for (var i = 0; i < root_node.length; i++) {
                    var a = document.createElement("a");
                    a.setAttribute("href", baggeneral.getNullValue(root_node[0].querySelectorAll("urlMenu")));
                    a.innerHTML = baggeneral.getNullValue(root_node[0].querySelectorAll("nameMenu"));
                    div.appendChild(a);
                }
                viewContent.appendChild(div);
                
            }            
        }
        var input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("onclick", "bagrequest.exitUser();");
        input.setAttribute("value", "Выйти");
        viewContent.appendChild(input);
    },
    createUserBox: function (idProperty) {
        bagrequest.sendRequest(null, "POST", "/xml/general.asmx/getUserMenu", baglogin.endCreateUserBox, idProperty);
    },

    createLoginBox: function (idProperty) {
        var viewContent = document.getElementById(idProperty + "_viewContent");
        viewContent.innerHTML = "";
        var div = document.createElement("div");
        div.setAttribute("class", "errormeessage");
        div.setAttribute("id", "errorlogin");
        viewContent.appendChild(div);

        div = document.createElement("div");
        var lab = document.createElement("label");
        lab.setAttribute("for", "userName");
        lab.innerHTML = "Логин";
        div.appendChild(lab);
        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "userName");
        input.setAttribute("name", "userName");
        div.appendChild(input);
        viewContent.appendChild(div);

        div = document.createElement("div");
        lab = document.createElement("label");
        lab.setAttribute("for", "userPassword");
        lab.innerHTML = "Пароль";
        div.appendChild(lab);
        input = document.createElement("input");
        input.setAttribute("type", "password");
        input.setAttribute("id", "userPassword");
        input.setAttribute("name", "userPassword");
        div.appendChild(input);
        viewContent.appendChild(div);

        input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("onclick", "baglogin.loginUser();");
        input.setAttribute("value", "Войти");
        viewContent.appendChild(input);

        var span = document.createElement("span");
        span.setAttribute("onclick", "baglogin.viewEmail('" + idProperty + "');");
        span.innerHTML = "Забыли пароль?";
        viewContent.appendChild(span);
    },
};