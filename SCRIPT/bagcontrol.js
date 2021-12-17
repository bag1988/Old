var bagcontrol = {
    endloadModuleMenu: function (xmldoc, args) {
        if (xmldoc) {
            if(!document.getElementById(args + "_edit"))
            {                
                var container = document.getElementById(args + "_container");                
                var viewContent = document.getElementById(args + "_viewContent");
                var dl = document.createElement("dl");
                dl.setAttribute("class", "edit_module");
                dl.setAttribute("onmousedown", "bagmoving.movingContainer();");
                dl.setAttribute("id", args + "_edit");

                var dt = document.createElement("dt");
                dt.innerHTML = "&bull;&bull;&bull;&bull;";

                var dlChild = document.createElement("dl");            
                dlChild.setAttribute("id", args + "_menu_module");

                dt.appendChild(dlChild);
                dl.appendChild(dt);

                var root_node = xmldoc.querySelectorAll("menu");
                if (root_node.length > 0) {
                    for (var i = 0; i < root_node.length; i++) {
                        dt = document.createElement("dt");
                        dt.innerHTML = baggeneral.getNullValue(root_node[i].querySelectorAll("InnerHtml"));
                        dt.setAttribute("onclick", baggeneral.getNullValue(root_node[i].querySelectorAll("onclick")));
                        dlChild.appendChild(dt);
                    }
                    container.insertBefore(dl, viewContent);
                }
                if (document.body.querySelectorAll(".edit_module").length>0){
                    container.onmousedown = function (event) {
                        event = event || window.event;
                        var t = event.target || event.srcElement;
                        if (event.button == 2) {
                            document.oncontextmenu = function (e) { return false };
                            bagcontrol.deleteSubMenu();
                            var div = document.createElement("div");
                            div.setAttribute("class", "subMenuDivControl");
                            var new_y = event.pageY;
                            if (document.body.style.marginTop != "") {
                                new_y = new_y - parseInt(document.body.style.marginTop);
                            }
                            div.setAttribute("style", "top:" + new_y + "px;left:" + event.pageX + "px;");
                            div.innerHTML = dlChild.innerHTML;
                            this.parentNode.appendChild(div);
                            document.body.onclick = function () {
                                bagcontrol.deleteSubMenu();
                            }
                        }
                        event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
                        //event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                    }
                }
            }
        }
    },
    deleteSubMenu:function()
    {
        var ar = document.body.querySelectorAll(".subMenuDivControl");
        for (var i = 0; i < ar.length; i++) {
            ar[i].parentNode.removeChild(ar[i]);
        }
        document.body.onclick = null;
    },
    loadModuleMenu:function(idProperty)
    {
        if (document.getElementById("admin_panel")) {
            var b = document.getElementById("admin_controls1_editModeBool");
            if (b.value == "true") {
                var formData = new FormData();
                formData.append("idProperty", idProperty);
                bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/getModuleMenu", bagcontrol.endloadModuleMenu, idProperty);
            }
        }
    },

    loadTextBox:function(idProperty)
    {        
        var formData = new FormData();
        formData.append("idProperty", idProperty);        
        bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/htmlText", bagcontrol.endLoadTextBox, idProperty);
    },
    endLoadTextBox:function(xmldoc, args)
    {       
        if (xmldoc) {            
            var viewContent = document.getElementById(args + "_viewContent");
            var root_node = xmldoc.querySelectorAll("moduleText");            
            if (root_node.length > 0) {
                var div = document.createElement("div");
                div.innerHTML = baggeneral.getNullValue(root_node[0].querySelectorAll("htmlText"));
                viewContent.innerHTML = div.innerHTML;
            }            
        }
        bagcontrol.loadModuleMenu(args);
    },

    loadNavMenu: function (idProperty) {
        var formData = new FormData();
        formData.append("idProperty", idProperty);
        formData.append("parentMenu", "0");
        bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/navMenu", bagcontrol.endLoadNavMenu, idProperty);
    },
    endLoadNavMenu: function (xmldoc, args) {        
        if (xmldoc) {
            var viewContent = document.getElementById(args + "_viewContent");
            viewContent.innerHTML = "";
            viewContent.appendChild(bagcontrol.createEditMenu(xmldoc, "Menu0"));             
        }
        bagcontrol.loadModuleMenu(args);
    },
    createEditMenu: function (xmldoc, tagMenu) {        
        var root_node = xmldoc.querySelectorAll(tagMenu);
        var ul = document.createElement("ul");        
        if (root_node.length > 0) {
            for (var i = 0; i < root_node.length; i++) {
                var a = document.createElement("a");
                a.innerText = root_node[i].querySelectorAll("nameMenu")[0].childNodes[0].nodeValue;
                a.setAttribute("href", root_node[i].querySelectorAll("urlMenu")[0].childNodes[0].nodeValue);
                var li = document.createElement("li");
                li.appendChild(a);
                li.appendChild(bagcontrol.createEditMenu(xmldoc, "Menu" + root_node[i].querySelectorAll("idMenu")[0].childNodes[0].nodeValue));
                ul.appendChild(li);
            }
        }
        return ul;
    },

    endLoadLoginBox:function(xmldoc, args)
    {
        if (xmldoc) {            
            var root_node = xmldoc.querySelectorAll("boolLogin");
            if (root_node.length > 0) {
                
                var boolLogin = root_node[0].childNodes[0].nodeValue;
                if (boolLogin == "True" || boolLogin == "true")
                    baglogin.createUserBox(args);
                if (boolLogin == "False" || boolLogin == "false")
                    baglogin.createLoginBox(args);
            }
        }
        bagcontrol.loadModuleMenu(args);
    },
    loadLoginBox: function(idProperty)
    {
        bagrequest.sendRequest(null, "POST", "/xml/general.asmx/boolLogin", bagcontrol.endLoadLoginBox, idProperty);
    },
    
    loadSlider: function (idProperty) {        
        var formData = new FormData();
        formData.append("optionsBlock", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/optionsBlock", bagcontrol.endLoadSlider, idProperty);
    },
    endLoadSlider: function (xmldoc, args) {
        if (xmldoc) {
            var viewContent = document.getElementById(args + "_viewContent");
            viewContent.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("options");
            if (root_node.length > 0) {
                var arraySlider = [];
                arraySlider = root_node[0].querySelectorAll("slider");
                var enableSlider = baggeneral.getNullValue(root_node[0].querySelectorAll("enableSlider"));
                var timeSlider = baggeneral.getNullValue(root_node[0].querySelectorAll("timeSlider"));
                if (enableSlider == "")
                    enableSlider = "true";
                if (timeSlider == "")
                    timeSlider = 5;
                timeSlider = timeSlider * 1000;
                var typeSlider = baggeneral.getNullValue(root_node[0].querySelectorAll("typeSlider"));
                if (arraySlider) {
                    for (var i = 0; i < arraySlider.length; i++) {
                        var imgSlider = arraySlider[i].childNodes[0].nodeValue.match(/imgSlider:[^\s\&]*(?=&)/)[0].split(':')[1];
                        var textSlider = arraySlider[i].childNodes[0].nodeValue.match(/textSlider:[^\&]*(?=&)/)[0].split(':')[1];
                        var d = document.createElement("div");
                        if (typeSlider == "fon" || typeSlider == "")
                            d.setAttribute("style", "background-image: url(" + imgSlider + "); z-Index:" + i + ";");
                        if (typeSlider == "img") {
                            var img = document.createElement("img");
                            img.setAttribute("src", imgSlider);
                            img.setAttribute("title", textSlider);
                            d.appendChild(img);
                        }
                        var p = document.createElement("p");
                        p.innerHTML = textSlider;
                        d.appendChild(p);
                        if (i == 0)
                            d.style.display = "block";
                        else
                            d.style.display = "none";
                        viewContent.appendChild(d);
                    }
                    if (enableSlider == "true")
                        setTimeout(function () { bagcontrol.nextSlider(args, timeSlider) }, timeSlider);
                }
            }
        }
        bagcontrol.loadModuleMenu(args);
    },
    nextSlider: function (idProperty, timeSlider) {
        var viewContent = document.getElementById(idProperty + "_viewContent");
        var arrayDiv = viewContent.querySelectorAll("div");
        for (var i = 0; i < arrayDiv.length; i++) {
            if (arrayDiv[i].style.display == "block") {
                if (i + 1 < arrayDiv.length) {
                    bagcontrol.opacitySlider(arrayDiv[i], arrayDiv[i + 1], idProperty, timeSlider); break;
                }
                else {
                    bagcontrol.opacitySlider(arrayDiv[i], arrayDiv[0], idProperty, timeSlider); break;
                }
            }
        }
    },
    opacitySlider: function (oldDiv, newDiv, idProperty, timeSlider) {
        if (newDiv.style.display == "none") {
            oldDiv.style.opacity = 1;
            oldDiv.style.filter = 'alpha(opacity=' + 100 + ')';
            newDiv.style.opacity = 0;
            newDiv.style.filter = 'alpha(opacity=' + 0 + ')';
            newDiv.style.display = "block";
        }
        if (oldDiv.style.display == "block") {
            var oldOp = (oldDiv.style.opacity) ? parseFloat(oldDiv.style.opacity) : parseInt(oldDiv.style.filter) / 100;
            var newOp = (newDiv.style.opacity) ? parseFloat(newDiv.style.opacity) : parseInt(newDiv.style.filter) / 100;

            oldOp -= 0.05;
            newOp += 0.05;

            oldDiv.style.opacity = oldOp;
            oldDiv.style.filter = 'alpha(opacity=' + oldOp * 100 + ')';
            newDiv.style.opacity = newOp;
            newDiv.style.filter = 'alpha(opacity=' + newOp * 100 + ')';
            if ((oldOp) == 0) {
                oldDiv.style.display = "none";
                setTimeout(function () { bagcontrol.nextSlider(idProperty, timeSlider) }, timeSlider);
            }
            else {
                setTimeout(function () { bagcontrol.opacitySlider(oldDiv, newDiv, idProperty, timeSlider) }, 50);
            }
        }
    },
    
    endLoadBox: function (xmldoc, args) {
        if (xmldoc) {
            var viewContent = document.getElementById(args + "_viewContent");
            viewContent.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("control");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var idProperty =  baggeneral.getNullValue(root_node[i].querySelectorAll("idProperty"));                    
                    var div = document.createElement("div");
                    var content = document.createElement("div");                    
                    div.setAttribute("id", idProperty + "_container");
                    div.setAttribute("class", baggeneral.getNullValue(root_node[i].querySelectorAll("class")));
                    content.setAttribute("id", idProperty + "_viewContent");
                    div.appendChild(content);
                    viewContent.appendChild(div);
                    var loads = baggeneral.getNullValue(root_node[i].querySelectorAll("onLoad"));                    
                    baggeneral.stringNameFun(loads, window, idProperty);
                }   
            }
        }
        bagcontrol.loadModuleMenu(args);
    },
    loadBox: function (idProperty) {
        if (baggeneral.getPageId()) {            
            var formData = new FormData();
            formData.append("idProperty", idProperty);
            formData.append("idPage", baggeneral.getPageId());
            bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/loadBox", bagcontrol.endLoadBox, idProperty);
        }
    },

    endloadUserInfo: function (xmldoc, args) {
        if (xmldoc) {
            var viewContent = document.getElementById(args + "_viewContent");
            var root_node = xmldoc.querySelectorAll("field");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var enName = baggeneral.getNullValue(root_node[i].querySelectorAll("enNameField"));
                    var nameField = baggeneral.getNullValue(root_node[i].querySelectorAll("nameField"));
                    var valueField = baggeneral.getNullValue(root_node[i].querySelectorAll("valueField"));                    
                    if (valueField != "") {
                        var input = viewContent.querySelector("#" + enName);
                        input.value = valueField;
                    }
                }                
            }
        }
    },
    endloadUserField: function (xmldoc, args) {
        if (xmldoc) {
            var viewContent = document.getElementById(args + "_viewContent");
            viewContent.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("field");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var enName = baggeneral.getNullValue(root_node[i].querySelectorAll("enNameField"));
                    var nameField = baggeneral.getNullValue(root_node[i].querySelectorAll("nameField"));
                    var typeField = baggeneral.getNullValue(root_node[i].querySelectorAll("typeField"));
                    var valueField = baggeneral.getNullValue(root_node[i].querySelectorAll("valueField"));
                    var regexField = baggeneral.getNullValue(root_node[i].querySelectorAll("regexField"));
                    var messageRegex = baggeneral.getNullValue(root_node[i].querySelectorAll("messageRegex"));
                    var enabledField = baggeneral.getNullValue(root_node[i].querySelectorAll("enabledField"));
                    var div_field = document.createElement("div");
                    if (nameField != "") {                        
                        div_field.appendChild(bagfield.createLabel(enName, nameField, null));
                    }
                    var field = null;
                    switch (typeField) {
                        case "select":
                            field = bagfield.createSelect(enName, valueField);
                            break;
                        case "text":
                            field = bagfield.createText(enName, valueField);
                            break;
                        case "textarea":
                            field = bagfield.createTextarea(enName, valueField);
                            break;
                    }
                    bagRegexp[enName] = ({ "isNull": enabledField, "exp": regexField, "message": messageRegex });
                    div_field.appendChild(field);
                    viewContent.appendChild(div_field);
                }
                var button = bagfield.createButton("Сохранить", "bagrequest.saveInfoUser('" + args + "')");
                root_node = xmldoc.querySelectorAll("options");
                if (root_node.length > 0) {
                    button.setAttribute("data-page", baggeneral.getNullValue(root_node[0].querySelectorAll("pageView")));
                }
                var divButton = document.createElement("div");                
                divButton.appendChild(button);
                viewContent.appendChild(divButton);
                bagrequest.sendRequest(null, "POST", "/xml/loadControl.asmx/loadUserInfo", bagcontrol.endloadUserInfo, args);
            }
        }
        bagcontrol.loadModuleMenu(args);
    },
    loadUserField: function (idProperty) {
        var formData = new FormData();
        formData.append("idProperty", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/loadUserField", bagcontrol.endloadUserField, idProperty);

    },
};