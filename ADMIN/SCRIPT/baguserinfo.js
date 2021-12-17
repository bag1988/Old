var baguserinfo = {
    optionsField: function (idProperty) {
        var name_dialog = "dialog_optionsUserInfo";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div  id='viewUserField'></div><input id='selectUserField' type='hidden' value=''/>";

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "baguserinfo.addUserField('new');" });
        button_array.push({ "name": "Редактировать", "func": "baguserinfo.editUserField('" + idProperty + "');" });
        button_array.push({ "name": "Удалить", "func": "baguserinfo.deleteUserField('" + idProperty + "');" });        
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');bagcontrol.loadUserField('" + idProperty + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Редактор полей блока", null, button_array, inner_html);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        bagrequest.sendRequest(null, "POST", "/xml/loadControl.asmx/loadUserField", baguserinfo.endGetInfoField, null);
    },
    endGetInfoField: function (xmldoc, args) {
        if (xmldoc) {
            var viewContent = document.getElementById("viewUserField");
            viewContent.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("field");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var idField = baggeneral.getNullValue(root_node[i].querySelectorAll("idField"));
                    var nameField = baggeneral.getNullValue(root_node[i].querySelectorAll("nameField"));
                    var enabledField = baggeneral.getNullValue(root_node[i].querySelectorAll("enabledField"));
                    var d = document.createElement("div");
                    d.setAttribute("id", idField + "_field");
                    d.setAttribute("class", "selectedContent");
                    d.setAttribute("onclick", "baguserinfo.selectUserField(this)");
                    var p = document.createElement("p");
                    p.innerHTML = "<b>"+ nameField+"</b><br/>" + (enabledField == "true" ? "Обязательное поле" : "Необязательное поле");
                    d.appendChild(p);                    
                    viewContent.appendChild(d);
                }
                baggeneral.centerDiv("dialog_optionsUserInfo");
            }
            else
                viewContent.innerHTML = "Нет данных!";
        }
    },
    selectUserField: function (div) {
        document.getElementById("selectUserField").value = div.id.split('_')[0];
        baggeneral.selectedActivDiv(div);
    },

    addUserField: function (opt) {
        if (opt == "edit")
            opt = "Редактирование элемента";
        else
            opt = "Добавление элемента";
        document.getElementById("selectUserField").value = "";
        var name_dialog = "dialog_newUserField";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "enNameFiled", "type": "text", "name": "Идентификатор*", "value": "", "infoField": "Используйте латинские символы без пробелов" });
        field_array.push({ "id": "nameUserField", "type": "text", "name": "Наименование*", "value": "" });
        field_array.push({ "id": "typeUserField", "type": "select", "name": "Тип*", "value": "text:Строка;textarea:Текст;select:Выбор" });
        field_array.push({ "id": "valueUserField", "type": "textarea", "name": "Значение", "value": "", "infoField": "Для типа 'Выбор' используйте ввод - '[значение]:[текст];'" });
        field_array.push({ "id": "regexUserField", "type": "select", "name": "Регулярное выражение", "value": "" });
        field_array.push({ "id": "regexValue", "type": "textarea", "name": "Значение регулярного выражения", "value": "" });
        field_array.push({ "id": "regexMessage", "type": "textarea", "name": "Сообщения при неправильном вводе", "value": "" });
        field_array.push({ "id": "enabledRegex", "type": "select", "name": "Обязательное поле*", "value": "true:Да;false:Нет" });
        
        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "baguserinfo.saveNewField();" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, opt, field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        document.getElementById("valueUserField").setAttribute("style", "min-width:200px; min-height: 100px;");
        document.getElementById("regexValue").setAttribute("style", "min-width:200px; min-height: 100px;");
        document.getElementById("regexMessage").setAttribute("style", "min-width:200px; min-height: 100px;");
        baguserinfo.createRegex(document.getElementById("regexUserField"));
        baggeneral.centerDiv(name_dialog);
    },
    endInfoField: function (xmldoc, args) {
        if (xmldoc) {            
            var root_node = xmldoc.querySelectorAll("field");
            if (root_node.length > 0) {
                baguserinfo.addUserField("edit");
                for (var i = 0; i < root_node.length; i++) {
                    var enName = baggeneral.getNullValue(root_node[i].querySelectorAll("enNameField"));
                    var nameField = baggeneral.getNullValue(root_node[i].querySelectorAll("nameField"));
                    var typeField = baggeneral.getNullValue(root_node[i].querySelectorAll("typeField"));
                    var valueField = baggeneral.getNullValue(root_node[i].querySelectorAll("valueField"));
                    var regexField = baggeneral.getNullValue(root_node[i].querySelectorAll("regexField"));
                    var messageRegex = baggeneral.getNullValue(root_node[i].querySelectorAll("messageRegex"));
                    var enabledField = baggeneral.getNullValue(root_node[i].querySelectorAll("enabledField"));
                                        
                    document.getElementById("enNameFiled").value = enName;
                    document.getElementById("nameUserField").value = nameField;
                    document.getElementById("typeUserField").value = typeField;
                    document.getElementById("valueUserField").value = valueField;
                    document.getElementById("regexValue").value = regexField;
                    document.getElementById("regexMessage").value = messageRegex;
                    document.getElementById("enabledRegex").value = enabledField;
                }                
                document.getElementById("selectUserField").value = args;
            }
        }
    },
    editUserField: function (idProperty) {
        var selectUserField = document.getElementById("selectUserField").value;
        if (selectUserField == "")
            baggeneral.viewMessage("dialog_messageEditField", "Выберите элемент для редактирования!");
        else {
            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("idField", selectUserField);
            bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/loadUserField", baguserinfo.endInfoField, selectUserField);

        }
    },
    createRegex: function (obj) {
        var option = document.createElement("option");
        option.innerText = "Емаил";
        option.value = "^[a-z0-9.-]+@[a-z0-9.-]+\.\w{2,6}$";
        obj.appendChild(option);

        option = document.createElement("option");
        option.innerText = "Адрес URL";
        option.value = "http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?";
        obj.appendChild(option);

        option = document.createElement("option");
        option.innerText = "Номер телефона";
        option.value = "^\+?\d{1,3}[\(\-\s]?\d{1,3}[\)\-\s]?\d{2,3}[\-\s]?\d{2,3}[\-\s]?\d{2,3}$";
        obj.appendChild(option);

        option = document.createElement("option");
        option.innerText = "Числовое поле";
        option.value = "^\d*$";
        obj.appendChild(option);

        obj.onclick = function () {
            document.getElementById("regexValue").value = this.value;
        }
    },
    saveNewField: function () {
        var idField = document.getElementById("selectUserField").value;
        var enNameField = document.getElementById("enNameFiled").value;
        var nameUserField = document.getElementById("nameUserField").value;
        var typeUserField = document.getElementById("typeUserField").value;
        var valueUserField = document.getElementById("valueUserField").value;
        var regexValue = document.getElementById("regexValue").value;
        var regexMessage = document.getElementById("regexMessage").value;
        var enabledRegex = document.getElementById("enabledRegex").value;
        if (enNameField != "" && nameUserField != "" && typeUserField != "" && (enabledRegex == "true" || enabledRegex == "false")) {
            var formData = new FormData();
            formData.append("idField", idField);
            formData.append("enNameField", enNameField);
            formData.append("nameField", nameUserField);
            formData.append("typeField", typeUserField);
            formData.append("enabledField", enabledRegex);
            formData.append("valueField", valueUserField);
            formData.append("regexField", regexValue);
            formData.append("messageRegex", regexMessage);
            
            bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/newUserField", baguserinfo.endSaveNewField, null);
            document.getElementById("selectUserField").value = "";
        }
        else
            baggeneral.viewMessage("dialog_messageSaveField", "Поля обозначенные как '*' обязательны для заполнения");
    },
    endSaveNewField: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_newUserField");
        bagrequest.sendRequest(null, "POST", "/xml/loadControl.asmx/loadUserField", baguserinfo.endGetInfoField, null);
    },

    endDeleteField: function (xmldoc, args) {
        bagrequest.sendRequest(null, "POST", "/xml/loadControl.asmx/loadUserField", baguserinfo.endGetInfoField, null);
    },
    startDeleteField: function (idField) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idField", idField);
        bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/deleteUserField", baguserinfo.endDeleteField, null);
        baggeneral.closeSubmenu("dialog_deleteUserField");
    },
    deleteUserField: function () {
        var selectUserField = document.getElementById("selectUserField").value;
        if (selectUserField != "") {
            var name_dialog = "dialog_deleteUserField";
            if (document.getElementById(name_dialog))
                baggeneral.closeSubmenu(name_dialog);
            var inner_html = "Внимание!!! Будет удалена информация о пользователе!<br/>Продолжить?";
            var button_array = new Array();
            button_array.push({ "name": "Удалить", "func": "baguserinfo.startDeleteField('" + selectUserField + "');" });
            button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

            var submenu = baggeneral.createSubmenu(name_dialog, "Удаление элемента", null, button_array, inner_html);

            submenu.setAttribute("class", "view_submenu");
            submenu.setAttribute("style", "display:block; max-width: 80%;");

            baggeneral.centerDiv(name_dialog);
        }
        else
            baggeneral.viewMessage("dialog_messagedeleteFiled", "Пожалуйста, выберите элемент для удаления!");
    },


    optionsBlock: function (idProperty) {
        var name_dialog = "dialog_optionsBlock";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();        
        field_array.push({ "id": "pageView", "type": "text", "name": "Адрес страницы после сохранения данных", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "baguserinfo.saveOptionsBlock('" + idProperty + "');" });
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Настройки блока", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";

        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("optionsBlock", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/optionsBlock", baguserinfo.endGetInfoBlock, null);
    },
    endGetInfoBlock: function (xmldoc, args) {
        if (xmldoc) {
            var pageView = document.getElementById("pageView");
            var root_node = xmldoc.querySelectorAll("options");
            if (root_node.length > 0) {
                pageView.value = baggeneral.getNullValue(root_node[0].querySelectorAll("pageView"));
            }
        }
    },
    endSaveOptionsBlock: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageSaveOptions", "Записано!");
    },
    saveOptionsBlock: function (idProperty) {
        var pageView = document.getElementById("pageView").value;
        if (idProperty != "") {
            var ar = new Array();
            ar.push({ name: "pageView", value: pageView });
            var formData = new FormData();
            formData.append("idProperty", idProperty);
            formData.append("property", JSON.stringify(ar, "", 2));
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveOptionsBlock", baguserinfo.endSaveOptionsBlock, null);
        }
        else
            baggeneral.viewMessage("dialog_messageSaveOptions", "Заполните все поля!");
    },
};