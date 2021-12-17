var bagslider = { 
    optionsBlock: function (idProperty) {
        var name_dialog = "dialog_optionsSlider";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div  id='viewallslider'></div><input id='selectslider' type='hidden' value=''/>";
               
        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagslider.addSlider('new', '" + idProperty + "');" });
        button_array.push({ "name": "Редактировать", "func": "bagslider.editSlider('" + idProperty + "');" });
        button_array.push({ "name": "Удалить", "func": "bagslider.deleteSlider('" + idProperty + "');" });
        button_array.push({ "name": "Настройки", "func": "bagslider.editOptions('" + idProperty + "');" });
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');bagcontrol.loadSlider('" + idProperty + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Настройки блока", null, button_array, inner_html);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";

        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("optionsBlock", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/optionsBlock", bagslider.endGetInfoBlock, null);
    },
    endGetInfoBlock: function (xmldoc, args) {
        if (xmldoc) {
            var viewallslider = document.getElementById("viewallslider");
            viewallslider.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("options");
            if (root_node.length > 0) {
                var arraySlider = root_node[0].querySelectorAll("slider");
                if (arraySlider) {
                    for (var i = 0; i < arraySlider.length; i++) {
                        var idSlider = root_node[0].querySelectorAll("idOptions")[i].childNodes[0].nodeValue;
                        var imgSlider = arraySlider[i].childNodes[0].nodeValue.match(/imgSlider:[^\s\&]*(?=&)/)[0].split(':')[1];
                        var textSlider = arraySlider[i].childNodes[0].nodeValue.match(/textSlider:[^\&]*(?=&)/)[0].split(':')[1];

                        var d = document.createElement("div");
                        d.setAttribute("id", idSlider + "_slider");
                        d.setAttribute("class", "selectedContent");
                        d.setAttribute("onclick", "bagslider.selectSlider(this)");
                        var p = document.createElement("p");
                        p.innerHTML = textSlider;
                        d.appendChild(p);
                        var span = document.createElement("b");
                        span.innerHTML = imgSlider;
                        d.appendChild(span);
                        viewallslider.appendChild(d);
                    }
                }
                baggeneral.centerDiv("dialog_optionsSlider");
            }
            else
                viewallslider.innerHTML = "Нет слайдов!";

        }
    },
    selectSlider: function (div) {
        document.getElementById("selectslider").value = div.id.split('_')[0];
        baggeneral.selectedActivDiv(div);
    },
    editSlider: function (idProperty) {
        var idEditSlider = document.getElementById("selectslider").value;
        if (idEditSlider == "")
            baggeneral.viewMessage("dialog_messageEditSlider", "Выберите слайд для редактирования!");
        else {
            var div = document.getElementById(idEditSlider + "_slider");
            bagslider.addSlider("edit", idProperty);
            var imgSlider = div.querySelectorAll("b")[0].innerHTML;
            var textSlider = div.querySelectorAll("p")[0].innerHTML;
            document.getElementById("newTextSlider").value = textSlider;
            document.getElementById("newImgSlider").value = imgSlider;
            document.getElementById("selectslider").value = idEditSlider;
        }
    },
    addSlider: function(opt, idProperty)
    {
        if (opt == "edit")
            opt = "Редактирование слайда";
        else
            opt = "Добавление слайда";
        var name_dialog = "dialog_newSlider";
        document.getElementById("selectslider").value = "";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();        
        field_array.push({ "id": "newImgSlider", "type": "text", "name": "Изображение", "value": "" });
        field_array.push({ "id": "newTextSlider", "type": "textarea", "name": "Текст", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Выбор изображения", "func": "baggeneral.openDialogSelectImage('newImgSlider');" });
        button_array.push({ "name": "Сохранить", "func": "bagslider.saveNewSlider('" + idProperty + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, opt, field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
       
        document.getElementById("newTextSlider").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);
    },
    saveNewSlider: function (idProperty)
    {
        var idEditSlider = document.getElementById("selectslider").value;
        var newImgSlider = document.getElementById("newImgSlider").value;
        var newTextSlider = document.getElementById("newTextSlider").value;
        if (newImgSlider != "" && newTextSlider != "") {
            var formData = new FormData();
            formData.append("idSlider", idEditSlider);
            formData.append("idProperty", idProperty);
            formData.append("imageSlider", newImgSlider);
            formData.append("textSlider", newTextSlider);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveNewSlider", bagslider.endSaveOptionsBlock, idProperty);
            idEditSlider.value = "";
        }
        else
            baggeneral.viewMessage("dialog_messageSaveSlider", "Все поля обязательны!");
    },    
    endSaveOptionsBlock: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_newSlider");
        var formData = new FormData();
        formData.append("optionsBlock", args);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/optionsBlock", bagslider.endGetInfoBlock, null); 
    },
    editOptions: function (idProperty) {
        var name_dialog = "dialog_editOptionsSlider";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "enableSlider", "type": "select", "name": "Состояние", "value": "true:Включен;false:Выключен" });
        field_array.push({ "id": "timeSlider", "type": "text", "name": "Интервал в секундах", "value": "" });
        field_array.push({ "id": "typeSlider", "type": "select", "name": "Изображение", "value": "fon:В виде фона;img:Как изображение" });
       
        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "bagslider.saveOptions('" + idProperty + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Настройки", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
        var formData = new FormData();
        formData.append("optionsBlock", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/optionsBlock", bagslider.endGetInfoOptions, null);
    },
    endGetInfoOptions: function (xmldoc, args) {
        if (xmldoc) {
            var enableSlider = document.getElementById("enableSlider");
            var timeSlider = document.getElementById("timeSlider");
            var typeSlider = document.getElementById("typeSlider");
            var root_node = xmldoc.querySelectorAll("options");
            if (root_node.length > 0) {
                timeSlider.value = baggeneral.getNullValue(root_node[0].querySelectorAll("timeSlider"));
                typeSlider.value = baggeneral.getNullValue(root_node[0].querySelectorAll("typeSlider"));
                enableSlider.value = baggeneral.getNullValue(root_node[0].querySelectorAll("enableSlider"));
            }

        }
    },
    endSaveOptions: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_editOptionsSlider");
        bagcontrol.loadSlider(args);
    },
    saveOptions: function (idProperty) {
        var enableSlider = document.getElementById("enableSlider").value;
        var timeSlider = document.getElementById("timeSlider").value;
        var typeSlider = document.getElementById("typeSlider").value;
        if (idProperty != "" && (typeSlider != "" || timeSlider != "")) {
            var ar = new Array();
            ar.push({ name: "timeSlider", value: timeSlider });
            ar.push({ name: "typeSlider", value: typeSlider });
            ar.push({ name: "enableSlider", value: enableSlider });
            var formData = new FormData();
            formData.append("idProperty", idProperty);
            formData.append("property", JSON.stringify(ar, "", 2));
           bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveOptionsBlock", bagslider.endSaveOptions, idProperty);
        }
        else
            baggeneral.viewMessage("dialog_messageSaveOptions", "Заполните все поля!");
    },
    endDeleteSlider: function (xmldoc, args) {
        var oldSlider = document.getElementById(args + "_slider");
        oldSlider.parentNode.removeChild(oldSlider);
    },
    startDeleteSlider: function (idOptions) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idOptions", idOptions);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/deleteOptionsBlock", bagslider.endDeleteSlider, idOptions);
        baggeneral.closeSubmenu("dialog_deleteSlider");
    },
    deleteSlider: function () {
        var idSlider = document.getElementById("selectslider").value;
        if (idSlider != "") {
            var name_dialog = "dialog_deleteSlider";
            if (document.getElementById(name_dialog))
                baggeneral.closeSubmenu(name_dialog);
            var inner_html = "Внимание!!! Будет удален слайд!<br/>Продолжить?";

            var button_array = new Array();
            button_array.push({ "name": "Удалить", "func": "bagslider.startDeleteSlider('" + idSlider + "');" });
            button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

            var submenu = baggeneral.createSubmenu(name_dialog, "Удаление слайда", null, button_array, inner_html);

            submenu.setAttribute("class", "view_submenu");
            submenu.setAttribute("style", "display:block; max-width: 80%;");

            baggeneral.centerDiv(name_dialog);
        }
        else
            baggeneral.viewMessage("dialog_messagedeleteSlider", "Пожалуйста, выберите слайд для удаления!");
    },
};