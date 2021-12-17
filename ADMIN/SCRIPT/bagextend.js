var bagextend = { 
    editExtend: function (idExtend) {
        var name_dialog = "dialog_editExtend";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "nameEditExten", "type": "text", "name": "Наименование расширения", "value": "" });
        field_array.push({ "id": "textEditExtend", "type": "textarea", "name": "Описание расширения", "value": "" });
        field_array.push({ "id": "htmlEditExtend", "type": "textarea", "name": "Код HTML", "value": "" });
        field_array.push({ "id": "cssEditExtend", "type": "text", "name": "Класс CSS", "value": "" });
        field_array.push({ "id": "loadScriptExtend", "type": "text", "name": "Исполняемый javascript", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "bagextend.saveEditExtend('" + idExtend + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Редактирование расширения", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";


        document.getElementById("textEditExtend").setAttribute("style", "min-width:200px; min-height: 100px;");
        document.getElementById("htmlEditExtend").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("editExtend", idExtend);
        bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endGetInfoEdit, null);
    },
    endGetInfoEdit: function (xmldoc, args) {
        if (xmldoc) {
            var nameEditExten = document.getElementById("nameEditExten");
            var textEditExtend = document.getElementById("textEditExtend");
            var htmlEditExtend = document.getElementById("htmlEditExtend");
            var cssEditExten = document.getElementById("cssEditExtend");
            var loadScriptExtend = document.getElementById("loadScriptExtend");
            var root_node = xmldoc.querySelectorAll("exten");
            if (root_node.length > 0) {
                nameEditExten.value = baggeneral.getNullValue(root_node[0].querySelectorAll("nameExten"));
                textEditExtend.value = baggeneral.getNullValue(root_node[0].querySelectorAll("textExten"));
                htmlEditExtend.value = baggeneral.getNullValue(root_node[0].querySelectorAll("htmlExten"));
                cssEditExten.value = baggeneral.getNullValue(root_node[0].querySelectorAll("cssExten"));
                loadScriptExtend.value = baggeneral.getNullValue(root_node[0].querySelectorAll("scriptExtend"));

            }
            else
                baggeneral.viewMessage("dialog_messageinfoExtend", "Ошибка получения данных!");

        }
    },    

    endEditExtend: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageeditExtend", "Обновлено, происходит обновление страницы.");
        baggeneral.closeSubmenu("dialog_editExtend");
        location.reload();
    },
    saveEditExtend: function (idExtend) {        
        var nameExtend = document.getElementById("nameEditExten").value;
        var textExtend = document.getElementById("textEditExtend").value;
        var htmlExtend = document.getElementById("htmlEditExtend").value;
        var cssExtend = document.getElementById("cssEditExtend").value;
        var scriptExtend = document.getElementById("loadScriptExtend").value;
        htmlExtend = htmlExtend.replace(/</g, "&lt;");
        htmlExtend = htmlExtend.replace(/>/g, "&gt;");
        if (nameExtend != "" && textExtend != "" ) {
            var formData = new FormData();
            formData.append("idUpdateExtend", idExtend);
            formData.append("updateNameExtend", nameExtend);
            formData.append("updateTextExtend", textExtend);
            formData.append("updateDefaultHTML", htmlExtend);
            formData.append("updateDefaultCss", cssExtend);
            formData.append("updateScriptExtend", scriptExtend);
            bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endEditExtend, null);
        }
        else
            baggeneral.viewMessage("dialog_messageaddExtend", "Заполните все поля!");
    },

    endSaveNewExtend: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageaddExtend", "Записано, происходит обновление страницы.");
        baggeneral.closeSubmenu("dialog_newExtend");
        location.reload();
    },
    saveNewExtend: function () {

        var nameExtend = document.getElementById("nameNewExten").value;
        var textExtend = document.getElementById("textNewExtend").value;
        var htmlExtend = document.getElementById("htmlNewExtend").value;
        var cssExtend = document.getElementById("cssNewExtend").value;
        var scriptExtend = document.getElementById("scriptNewExtend").value;
        htmlExtend = htmlExtend.replace(/</g, "&lt;");
        htmlExtend = htmlExtend.replace(/>/g, "&gt;");

        if (nameExtend != "" && textExtend != "") {
            var formData = new FormData();
            formData.append("nameExtend", nameExtend);
            formData.append("textExtend", textExtend);
            formData.append("defaultHTML", htmlExtend);
            formData.append("defaultCss", cssExtend);
            formData.append("scriptExtend", scriptExtend);
            bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endSaveNewExtend, null);
        }
        else
            baggeneral.viewMessage("dialog_messageaddExtend", "Заполните все поля!");
    },
    newExtend: function () {
        var name_dialog = "dialog_newExtend";
        var field_array = new Array();
        field_array.push({ "id": "nameNewExten", "type": "text", "name": "Наименование расширения", "value": "" });
        field_array.push({ "id": "textNewExtend", "type": "textarea", "name": "Описание расширения", "value": "" });
        field_array.push({ "id": "htmlNewExtend", "type": "textarea", "name": "Код HTML", "value": "" });
        field_array.push({ "id": "cssNewExtend", "type": "text", "name": "Класс CSS", "value": "" });
        field_array.push({ "id": "scriptNewExtend", "type": "text", "name": "Исполняемый javascript", "value": "" });
        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagextend.saveNewExtend();" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Добавление расширения", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";


        document.getElementById("textNewExtend").setAttribute("style", "min-width:200px; min-height: 100px;");
        document.getElementById("htmlNewExtend").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);
    },

    endDeleteExtend: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageDeleteExtend", "Обновление страницы.");
        baggeneral.closeSubmenu("dialog_newExtend");
        location.reload();
    },
    startDeleteExtend: function (idExtend) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idExtend", idExtend);
        bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endDeleteExtend, null);
    },
    deleteExtend: function (idExtend) {
        var name_dialog = "dialog_deleteextend";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить", "func": "bagextend.startDeleteExtend('" + idExtend + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);
    },
   
    deleteFuncExtend: function(idExtend)
    {
        var idFunc = document.getElementById("selectFuncExten").value;
        if (idFunc != "") {
            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("deleteFuncExtend", idFunc);
            bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endSaveFunc, idExtend);
            document.getElementById("selectFuncExten").value = "";
        }
        else
            baggeneral.viewMessage("dialog_messagedeleteFunc", "Выберите функцию!");
    },
    endSaveFunc: function (xmldoc, args) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("funcExtend", args);
        bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endGetFunc, null);
        document.getElementById("selectFuncExten").value = "";
    },
    saveFuncExtend: function (idExtend, idFunc) {
        var nameFunc, valueFunc;
        if (document.getElementById("nameFunc") && document.getElementById("valueFunc")) {
            nameFunc = document.getElementById("nameFunc").value;
            valueFunc = document.getElementById("valueFunc").value;
        }
        if (document.getElementById("editNameFunc") && document.getElementById("editValueFunc")) {
            nameFunc = document.getElementById("editNameFunc").value;
            valueFunc = document.getElementById("editValueFunc").value;
        }
        if (nameFunc != "" && valueFunc != "") {
            var formData = new FormData();
            formData.append("nameFunc", nameFunc);
            formData.append("valueFunc", valueFunc);
            formData.append("idFunc", idFunc);
            formData.append("idExtendFunc", idExtend);
            bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endSaveFunc, idExtend);
        }
        else
            baggeneral.viewMessage("dialog_messageaddExtend", "Заполните все поля!");

    },
    newFuncExtend: function (idExtend) {
        var name_dialog = "dialog_newFuncExtend";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "nameFunc", "type": "text", "name": "Наименование меню", "value": "" });
        field_array.push({ "id": "valueFunc", "type": "text", "name": "Наименование функции", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "bagextend.saveFuncExtend('" + idExtend + "', 'new'); baggeneral.closeSubmenu('" + name_dialog + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Новая функция", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },
    editFuncExtend: function (idExtend) {
        var idFunc = document.getElementById("selectFuncExten").value;
        if (idFunc != "") {
            var name_dialog = "dialog_editFuncExtend";
            if (document.getElementById(name_dialog))
                baggeneral.closeSubmenu(name_dialog);
            var field_array = new Array();
            field_array.push({ "id": "editNameFunc", "type": "text", "name": "Наименование меню", "value": "" });
            field_array.push({ "id": "editValueFunc", "type": "text", "name": "Наименование функции", "value": "" });

            var button_array = new Array();
            button_array.push({ "name": "Сохранить", "func": "bagextend.saveFuncExtend('" + idExtend + "', '" + idFunc + "'); baggeneral.closeSubmenu('" + name_dialog + "');" });
            button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
            var submenu = baggeneral.createSubmenu(name_dialog, "Редактирование функции", field_array, button_array, null);
            submenu.setAttribute("class", "view_submenu");
            submenu.style.display = "block";
            baggeneral.centerDiv(name_dialog);

            var div = document.getElementById(idFunc + "_func");
            var listb = div.querySelectorAll("b");
            if (listb.length > 0) {
                document.getElementById("editNameFunc").value = listb[0].innerText;
                document.getElementById("editValueFunc").value = listb[1].innerText;
            }
        }
        else
            baggeneral.viewMessage("dialog_messageeditFunc", "Выберите функцию!");
    },
    endGetFunc: function (xmldoc, args) {
        if (xmldoc) {
            var viewFunc = document.getElementById("viewfuncextend");
            viewFunc.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("funcExten");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var d = document.createElement("div");
                    d.setAttribute("class", "selectedContent");
                    var p = document.createElement("p");
                    p.innerHTML = "Наименование меню: <b>" + root_node[i].querySelectorAll("nameFunc")[0].childNodes[0].nodeValue + "</b>";
                    p.innerHTML += "<br/>Наименование функции: <b>" + root_node[i].querySelectorAll("valueFunc")[0].childNodes[0].nodeValue + "</b>";
                    d.appendChild(p);
                    d.setAttribute("id", root_node[i].querySelectorAll("idFunc")[0].childNodes[0].nodeValue + "_func");
                    d.setAttribute("onclick", "bagextend.selectFuncExten(this)");
                    viewFunc.appendChild(d);
                }
            }
            else
                viewFunc.innerText = "Нет функций!";

        }
        baggeneral.centerDiv("dialog_funcExtend");
    },
    editFunc: function (idExtend) {
        var name_dialog = "dialog_funcExtend";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div  id='viewfuncextend'></div><input id='selectFuncExten' type='hidden' value=''/>";

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagextend.newFuncExtend('" + idExtend + "');" });
        button_array.push({ "name": "Удалить", "func": "bagextend.deleteFuncExtend('" + idExtend + "');" });
        button_array.push({ "name": "Редактировать", "func": "bagextend.editFuncExtend('" + idExtend + "');" });
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Пункты меню", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block; max-width: 80%;");

        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("funcExtend", idExtend);
        bagrequest.sendRequest(formData, "POST", "/admin/extend.aspx", bagextend.endGetFunc, null);
    },
    selectFuncExten: function (div) {        
        document.getElementById("selectFuncExten").value = div.id.split('_')[0];
        baggeneral.selectedActivDiv(div);
    },
};