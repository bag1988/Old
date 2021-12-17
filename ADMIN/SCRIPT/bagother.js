var bagother = {
    savePropertyFiltr: function () {
        var name_dialog = "dialog_savePropertyFiltr";
        var field_array = new Array();
        field_array.push({ "id": "nameExten", "type": "text", "name": "Наименование расширения", "value": "" });
        field_array.push({ "id": "nameSave", "type": "text", "name": "Наименование настройки", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Применить", "func": "bagother.setPropertyFiltr();" });
        button_array.push({ "name": "Очистить", "func": "location.assign(location.pathname);" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Фильтр", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);

        var nameExten = document.getElementById("nameExten");
        var nameSave = document.getElementById("nameSave")

        if (location.search) {
            var pair = (location.search.substr(1)).split('&');
            for (var i = 0; i < pair.length; i++) {
                if (pair[i].split('=')[0] == "nameExten")
                    nameExten.value = decodeURIComponent(pair[i].split('=')[1]);
                if (pair[i].split('=')[0] == "nameSave")
                    nameSave.value = decodeURIComponent(pair[i].split('=')[1]);
            }
        }
    },
    setPropertyFiltr: function () {
        var nameExten = document.getElementById("nameExten").value;
        var nameSave = document.getElementById("nameSave").value;
        location.assign(location.pathname + "?nameExten=" + nameExten + "&nameSave=" + nameSave);
    },

    endDeleteUnsedCss: function(xmldoc, args)
    {
        if (xmldoc) {
            var deleteUnsedCss = document.getElementById("deleteUnsedCss");
            deleteUnsedCss.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("unsedCss");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {                    
                    var p = document.createElement("p");
                    p.innerHTML = "Наименование стиля: <b>" + root_node[i].querySelectorAll("nameCss")[0].childNodes[0].nodeValue + "</b>";                    
                    deleteUnsedCss.appendChild(p);
                }
            }
            else
                deleteUnsedCss.innerHTML = "Нет неиспользуемых стилей.";
        }
        baggeneral.centerDiv("dialog_deleteUnsedCss");
    },
    endDeleteCss: function(xmldoc, args)
    {
        baggeneral.closeSubmenu("dialog_dialogDeleteCss");
        baggeneral.closeSubmenu("dialog_deleteUnsedCss");
        baggeneral.viewMessage("dialog_messageDeleteCss", "Файлы успешно удалены!");
    },
    startDeleteUnsedCss: function()
    {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("deleteUnsedCss", "deleteUnsedCss");
        bagrequest.sendRequest(formData, "POST", "/admin/view_save_property.aspx", bagother.endDeleteCss, null);
    },
    dialogDeleteCss: function()
    {
        var name_dialog = "dialog_dialogDeleteCss";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "Внимание!!! После удаления, данные файлы невозможно будет восстановить!";

        var button_array = new Array();
        button_array.push({ "name": "Удалить", "func": "bagother.startDeleteUnsedCss();" });
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block; max-width: 80%;");
        baggeneral.centerDiv(name_dialog);
    },
    deleteUnsedCss: function () {
        var name_dialog = "dialog_deleteUnsedCss";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div id='deleteUnsedCss' ></div>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить", "func": "bagother.dialogDeleteCss();" });
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Неиспользуемы стили", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block; max-width: 80%;");

        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("getUnsedCss", "getUnsedCss");
        bagrequest.sendRequest(formData, "POST", "/admin/view_save_property.aspx", bagother.endDeleteUnsedCss, null);
    },
      
    optionsBlock: function (idProperty) {
        var name_dialog = "dialog_optionsBlock";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "nameBlock", "type": "text", "name": "Наименование блока", "value": "" });
        field_array.push({ "id": "pageView", "type": "text", "name": "Путь к основной странице", "value": "" });
        field_array.push({ "id": "maxView", "type": "text", "name": "Кол-во отображаемых новостей", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "bagother.saveOptionsBlock('" + idProperty + "');" });
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Настройки блока", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";

        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("optionsBlock", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/optionsBlock", bagother.endGetInfoBlock, null);
    },
    endGetInfoBlock: function (xmldoc, args) {
        if (xmldoc) {
            var nameBlock = document.getElementById("nameBlock");
            var pageView = document.getElementById("pageView");
            var maxView = document.getElementById("maxView");
            var root_node = xmldoc.querySelectorAll("options");
            if (root_node.length > 0) {
                nameBlock.value = baggeneral.getNullValue(root_node[0].querySelectorAll("nameBlock"));
                pageView.value = baggeneral.getNullValue(root_node[0].querySelectorAll("pageView"));
                maxView.value = baggeneral.getNullValue(root_node[0].querySelectorAll("maxView"));
            }
        }
    },
    endSaveOptionsBlock: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageSaveOptions", "Записано!");
    },
    saveOptionsBlock: function (idProperty) {
        var nameBlock = document.getElementById("nameBlock").value;
        var pageView = document.getElementById("pageView").value;
        var maxView = document.getElementById("maxView").value;
        if (idProperty != "") {
            var ar = new Array();
            ar.push({ name: "nameBlock", value: nameBlock });
            ar.push({ name: "pageView", value: pageView });
            ar.push({ name: "maxView", value: maxView });
            var formData = new FormData();
            formData.append("idProperty", idProperty);
            formData.append("property", JSON.stringify(ar, "", 2));
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveOptionsBlock", bagother.endSaveOptionsBlock, null);
        }
        else
            baggeneral.viewMessage("dialog_messageSaveOptions", "Заполните все поля!");
    },
};