var bagmenu = {
    newMenu:function()
    {
        var name_dialog = "dialog_newMenu";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "newNameMenu", "type": "text", "name": "Наименование меню", "value": "" });
        field_array.push({ "id": "viewHavePages", "type": "select", "name": "Страницы", "value": "" });
        field_array.push({ "id": "newAdressMenu", "type": "text", "name": "Адрес", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagmenu.saveNewMenu('new');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Новый пункт меню", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);

        var viewHavePages = document.getElementById("viewHavePages");
        viewHavePages.onclick = function () {
            document.getElementById("newAdressMenu").value = this.value;
        };

        baggeneral.viewLoadingDiv();
        bagrequest.sendRequest(null, "POST", "/xml/general.asmx/getPages", bagmenu.endGetPages, null);
    },
    editMenu: function () {
        var idMenu = document.getElementById("selectmenu").value;
        if (idMenu != "") {
            var name_dialog = "dialog_newMenu";
            if (document.getElementById(name_dialog))
                baggeneral.closeSubmenu(name_dialog);
            var field_array = new Array();
            field_array.push({ "id": "newNameMenu", "type": "text", "name": "Наименование меню", "value": "" });
            field_array.push({ "id": "viewHavePages", "type": "select", "name": "Страницы", "value": "" });
            field_array.push({ "id": "newAdressMenu", "type": "text", "name": "Адрес", "value": "" });

            var button_array = new Array();
            button_array.push({ "name": "Изменить", "func": "bagmenu.saveNewMenu('edit');" });
            button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
            var submenu = baggeneral.createSubmenu(name_dialog, "Редактирование пункта меню", field_array, button_array, null);
            submenu.setAttribute("class", "view_submenu");
            submenu.style.display = "block";
            baggeneral.centerDiv(name_dialog);

            var viewHavePages = document.getElementById("viewHavePages");
            viewHavePages.onclick = function () {
                document.getElementById("newAdressMenu").value = this.value;
            };

            var newNameMenu = document.getElementById("newNameMenu");
            var newAdressMenu = document.getElementById("newAdressMenu");
            var span = document.getElementById(idMenu + "_menu");
            newNameMenu.value = span.innerText;
            newAdressMenu.value = span.getAttribute("title");

            baggeneral.viewLoadingDiv();
            bagrequest.sendRequest(null, "POST", "/xml/general.asmx/getPages", bagmenu.endGetPages, null);
        }
        else
            baggeneral.viewMessage("dialog_messageeditmenu", "Пожалуйста, выберите пункт меню для редактирования!");        
    },

    endDeleteLevelMenu: function(xmldoc, args)
    {
        var oldMenu = document.getElementById(args + "_menu");
        oldMenu.parentNode.parentNode.removeChild(oldMenu.parentNode);
    },
    startDeleteMenu: function (idOptions)
    {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idOptions", idOptions);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/deleteOptionsBlock", bagmenu.endDeleteLevelMenu, idOptions);
        baggeneral.closeSubmenu("dialog_deleteLevelMenu");
    },
    deleteMenu: function()
    {
        var idMenu = document.getElementById("selectmenu").value;
        if (idMenu != "") {
            var name_dialog = "dialog_deleteLevelMenu";
            if (document.getElementById(name_dialog))
                baggeneral.closeSubmenu(name_dialog);
            var span = document.getElementById(idMenu + "_menu");
            var inner_html = "Внимание!!! Будет удален пункт меню <b>"+span.innerText+"</b> и все его узлы. <br/>Продолжить?";

            var button_array = new Array();
            button_array.push({ "name": "Удалить", "func": "bagmenu.startDeleteMenu('" + idMenu + "');" });
            button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

            var submenu = baggeneral.createSubmenu(name_dialog, "Удаление пункта меню", null, button_array, inner_html);

            submenu.setAttribute("class", "view_submenu");
            submenu.setAttribute("style", "display:block; max-width: 80%;");

            baggeneral.centerDiv(name_dialog);
        }
        else
            baggeneral.viewMessage("dialog_messageeditmenu", "Пожалуйста, выберите пункт меню для удаления!");
    },
    endGetMenu: function(xmldoc, args)
    {
        if (xmldoc) {
            var viewMenu = document.getElementById("viewmenuoptions");
            viewMenu.innerHTML = "";
            var ul = document.createElement("ul");
            ul.setAttribute("class", "bagmenuUl");
            var span = document.createElement("span");
            span.innerText = "Меню";
            span.setAttribute("onclick", "bagmenu.setActivMenu(this)");
            span.setAttribute("title", "Меню");
            span.setAttribute("id", "0_menu");
            var li = document.createElement("li");
            li.appendChild(span);
            li.appendChild(bagmenu.createEditMenu(xmldoc, "Menu0"));
            ul.appendChild(li);
            viewMenu.appendChild(ul);
            document.getElementById("selectmenu").value = "";
        }
        baggeneral.centerDiv("dialog_menuoptions");
    },
    createEditMenu: function (xmldoc, tagMenu)
    {
        var root_node = xmldoc.querySelectorAll(tagMenu);
        var ul = document.createElement("ul");
        ul.setAttribute("class", "bagmenuUl");
        if (tagMenu == "Menu0")
            ul.setAttribute("style", "display:block;");
        if (root_node.length > 0) {
            for (var i = 0; i < root_node.length; i++) {
                var span = document.createElement("span");
                span.innerText = root_node[i].querySelectorAll("nameMenu")[0].childNodes[0].nodeValue;
                span.setAttribute("onclick", "bagmenu.setActivMenu(this)");
                span.setAttribute("title", root_node[i].querySelectorAll("urlMenu")[0].childNodes[0].nodeValue);
                span.setAttribute("id", root_node[i].querySelectorAll("idMenu")[0].childNodes[0].nodeValue + "_menu");
                var li = document.createElement("li");
                li.appendChild(span);
                li.appendChild(bagmenu.createEditMenu(xmldoc, "Menu" + root_node[i].querySelectorAll("idMenu")[0].childNodes[0].nodeValue));
                ul.appendChild(li);
            }
        }
        return ul;
    },
    setActivMenu:function(menuLi)
    {        
        var childArray = menuLi.parentNode.childNodes;
        if (childArray.length > 0) {
            for (var i = 0; i < childArray.length; i++) {
                if (childArray[i].tagName == "UL") {                    
                    if (childArray[i].style.display == "block")
                        childArray[i].style.display = "none";
                    else
                        childArray[i].style.display = "block";
                    break;
                }                
            }
        }
        document.getElementById("selectmenu").value = menuLi.id.split('_')[0];

        childArray = document.getElementById("viewmenuoptions").querySelectorAll("span");
        if (childArray.length > 0) {
            for (var i = 0; i < childArray.length; i++) {
                if (childArray[i].tagName == "SPAN") {
                    childArray[i].removeAttribute("style");
                }
            }
        }
        menuLi.setAttribute("style", "text-decoration:underline;");
    },
    menuOptions: function (idProperty) {
        var name_dialog = "dialog_menuoptions";
        if (!document.getElementById(name_dialog)) {
            var inner_html = "<div  id='viewmenuoptions'></div><input id='selectmenu' type='hidden' value=''/><input id='idPropertyHidden' type='hidden' value='"+idProperty+"'/>";

            var button_array = new Array();
            button_array.push({ "name": "Добавить", "func": "bagmenu.newMenu();" });
            button_array.push({ "name": "Удалить", "func": "bagmenu.deleteMenu();" });
            button_array.push({ "name": "Редактировать", "func": "bagmenu.editMenu();" });
            button_array.push({ "name": "Закрыть", "func": "bagmenu.closeEditMenu('" + idProperty + "');" });

            var submenu = baggeneral.createSubmenu(name_dialog, "Настройка меню", null, button_array, inner_html);

            submenu.setAttribute("class", "view_submenu");
            submenu.setAttribute("style", "display:block; max-width: 80%;");

            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("idProperty", idProperty);
            formData.append("parentMenu", "0");
            bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/navMenu", bagmenu.endGetMenu, null);
        }
        baggeneral.centerDiv(name_dialog);

    },
    closeEditMenu: function (idProperty)
    {
        baggeneral.closeSubmenu("dialog_menuoptions");
        bagcontrol.loadNavMenu(idProperty);
    },

    endGetPages: function (xmldoc, args) {        
        if (xmldoc) {
            var viewHavePages = document.getElementById("viewHavePages");
            viewHavePages.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("page");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var option = document.createElement("option");
                    option.innerText = root_node[i].querySelectorAll("namePage")[0].childNodes[0].nodeValue;
                    option.value = root_node[i].querySelectorAll("urlPage")[0].childNodes[0].nodeValue;
                    viewHavePages.appendChild(option);
                }
            }
        }
    },
        
    endSaveNewMenu: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_newMenu");
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idProperty", args);
        formData.append("parentMenu", "0");
        bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/navMenu", bagmenu.endGetMenu, null);
    },
    saveNewMenu: function (action) {
        baggeneral.viewLoadingDiv();
        var idProperty = document.getElementById("idPropertyHidden").value;
        var new_name_menu = document.getElementById("newNameMenu").value;
        var select_page = document.getElementById("newAdressMenu").value;
        var parent_menu = document.getElementById("selectmenu").value;
        if (select_page != "" && new_name_menu != "" && idProperty != "") {
            if (parent_menu == "") {
                parent_menu = 0;
                action = "new";
            }
            var ar = new Array();
            ar.push({ name: new_name_menu, value: select_page, dop: parent_menu });
            var formData = new FormData();            
            formData.append("idProperty", idProperty);
            formData.append("property", JSON.stringify(ar, "", 2));
            if(action=="new")
                bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveOptionsBlock", bagmenu.endSaveNewMenu, idProperty);
            if(action=="edit")
                bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/updateMenuLevel", bagmenu.endSaveNewMenu, idProperty);
        }
        else
            baggeneral.viewMessage("dialog_messagenewmenu", "Пожалуйста, заполните все поля!");
    },
};