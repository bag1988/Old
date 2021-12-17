var bagrequest = {

    objUpdate: null,

    getRequest: function () {
        var request;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
            if (request.overrideMimeType) {
                request.overrideMimeType("text/xml");
            }
        }
        else if (window.ActiveXObject) {
            try {
                request = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) { }
            }
        }
        if (!request) {
            baggeneral.viewMessage("dialog_messagegetreqest", "Giving up :(Csnnot create an XMLHTTP instance");
            return false;
        }
        return request;
    },

    sendRequest: function (fromdata, method, url_xml, uhandler, args, contentType) {
        //if (typeof contentType == 'undefined') contentType = 'application/x-www-form-urlencoded';
        //if (typeof contentType == 'undefined') contentType = 'multipart/form-data';        
        var xmldoc = document.createElement("div");
        var request = bagrequest.getRequest();
        if (request) {
            request.open(method, url_xml, true);
            if (typeof contentType != 'undefined') request.setRequestHeader('Content-Type', contentType);            
            request.onreadystatechange = function () {
                try {
                    if (request.readyState == 4) {                        
                        if (request.status == 200) {
                            xmldoc.innerHTML = request.responseText;
                            var root_node = xmldoc.querySelectorAll("error");
                            if (root_node.length > 0)
                                baggeneral.viewMessage("dialog_messageError", root_node[0].childNodes[0].nodeValue);
                            else {
                                uhandler(xmldoc, args);
                            }
                            baggeneral.hiddenLoading();
                        }
                        else {
                            request.abort();
                            baggeneral.hiddenLoading();
                            baggeneral.viewMessage("dialog_messageError", "С запросом возникла проблема. Адрес запроса: "+url_xml);
                        }
                    }
                }
                catch (e) {
                    request.abort();
                    baggeneral.hiddenLoading();
                    baggeneral.viewMessage("dialog_messageError", "Произошло исключение: " + e.description);
                }
            };
            request.send(fromdata);
        }
    },

    endGetStyle: function (xmldoc, args) {
        if (xmldoc) {
            var root_node = xmldoc.querySelectorAll("css");
            if (root_node.length > 0) {                
                bagcsseditor.className = baggeneral.getNullValue(root_node[0].querySelectorAll("className"));
                bagcsseditor.oldStyle = baggeneral.getNullValue(root_node[0].querySelectorAll("valueStyle"));
                bagcsseditor.insertIframe(args);
                bagcsseditor.parsingCssCode();                                
            }
        }
    },
    getStyle: function (idProperty) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idProperty", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/getStyle", bagrequest.endGetStyle, idProperty);
    },

    endDeleteModule: function (xmldoc, args) {
        var div = document.getElementById(args + "_container");
        div.parentNode.removeChild(div);
        baggeneral.closeSubmenu("dialog_deletemodule");
    },
    startDeleteModule: function (id_module) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idProperty", id_module);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/deleteModule", bagrequest.endDeleteModule, id_module);
    },
    deleteModule: function (id_module) {
        document.getElementById(id_module + "_edit").setAttribute("style", "background-color:red;");
        var name_dialog = "dialog_deletemodule";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить", "func": "bagrequest.startDeleteModule('" + id_module + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "'); document.getElementById('" + id_module + "_edit').removeAttribute('style');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);

    },

    endSaveStyle: function (xmldoc, args) {        
        bagcsseditor.closeCssEditor();
    },
    saveStyle: function () {
        if (bagrequest.objUpdate) {
            baggeneral.viewLoadingDiv();
            var style = bagcsseditor.getStyleTeg();
            style = style.replace(/(\s*\.\s*.*\s*\{\s*\})/ig, "");
            var formData = new FormData();
            formData.append("idProperty", bagrequest.objUpdate);
            formData.append("className", bagcsseditor.className);
            formData.append("style", style);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveStyle", bagrequest.endSaveStyle, null);
        }
    },

    endSaveChanges: function (xmldoc, args) {

    },
    saveChanges: function () {
        if (bageditor.idTextBox) {
            baggeneral.viewLoadingDiv();
            var divHtml;
            if (document.getElementById(bageditor.idTextBox + "_edited_html").style.display == "block") {
                divHtml = document.getElementById(bageditor.idTextBox + '_edited_html').value;
            }
            else if (document.getElementById(bageditor.idTextBox + "_viewContent").style.display == "block" || document.getElementById(bageditor.idTextBox + "_viewContent").style.display == "") {
                divHtml = document.getElementById(bageditor.idTextBox + "_viewContent").innerHTML;
            }
            var formData = new FormData();
            formData.append("idProperty", bageditor.idTextBox);
            formData.append("newHtml", divHtml);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveChange", bagrequest.endSaveChanges, null);
        }
    },

    endAddPage: function (xmldoc, args) {
        if (xmldoc) {            
            var view_templates = document.getElementById("view_templates");
            view_templates.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("templatePage");
            var option = document.createElement("option");
            option.innerText = "Пустая страница";
            option.value = "";            
            view_templates.appendChild(option);
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    option = document.createElement("option");
                    option.innerText = root_node[i].querySelectorAll("nameTemplate")[0].childNodes[0].nodeValue;
                    option.value = root_node[i].querySelectorAll("idTemplate")[0].childNodes[0].nodeValue;
                    view_templates.appendChild(option);
                }
            }
        }
    },
    addPage: function () {
        var name_dialog = "dialog_addpage";
        var field_array = new Array();
        field_array.push({ "id": "view_templates", "type": "select", "name": "Шаблон", "value": "" });
        field_array.push({ "id": "name_new_page", "type": "text", "name": "Наименование страницы", "value": "" });
        field_array.push({ "id": "name_new_page_en", "type": "text", "name": "Имя страницы(латинскими)", "value": "" });
        field_array.push({ "id": "new_page_roles", "type": "select", "name": "Доступность", "value": "all:Всем;register:Зарегистрированным пользователям;admin:Только администратору" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagrequest.saveNewPage();" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Новая страница", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
        baggeneral.viewLoadingDiv();
        bagrequest.sendRequest(null, "POST", "/xml/general.asmx/getTemplates", bagrequest.endAddPage, null);
    },
    endSaveNewPage: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_addpage");
    },
    saveNewPage: function () {
        var templates = document.getElementById("view_templates").value;
        var name_new_page = document.getElementById("name_new_page").value;
        var name_new_page_en = document.getElementById("name_new_page_en").value;
        var new_page_roles = document.getElementById("new_page_roles").value;
        if (name_new_page && name_new_page_en && new_page_roles) {            
            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("template", templates);
            formData.append("nameNewPage", name_new_page);
            formData.append("nameNewPageEn", name_new_page_en);
            formData.append("newPageRoles", new_page_roles);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveNewPage", bagrequest.endSaveNewPage, null);            
        }
        else
            baggeneral.viewMessage("dialog_messagePage", "Пожалуйста, заполните все поля!");
    },

    endSelectImgUser: function (xmldoc, args) {
        if (xmldoc) {
            var view_img = document.getElementById("view_img_user");
            view_img.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("imgUser");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var img = document.createElement("img");
                    img.src = root_node[i].childNodes[0].nodeValue;
                    view_img.appendChild(img);
                }
                view_img.setAttribute("onclick", "bagrequest.saveSelectImg('" + args + "');");
                var div = document.createElement("div");
                div.setAttribute("class", "view_submenu_button");
                var button = document.createElement("input");
                button.setAttribute("style", "float:none;display:inline-block;");
                button.setAttribute("type", "button");
                button.setAttribute("onclick", "bagrequest.getYetImages();");
                button.setAttribute("value", "Еще");
                div.appendChild(button);
                var h = document.createElement("input");
                h.setAttribute("id", "hiddenlistimg");
                h.setAttribute("type", "hidden");
                h.value = 0;
                div.appendChild(h);
                view_img.parentNode.appendChild(div);
            }
            else
                view_img.innerText = "Нет изображений!";

        }
        baggeneral.centerDiv("dialog_selectimage");
    },

    endGetYetImgUser: function (xmldoc, args) {
        if (xmldoc) {
            var view_img = document.getElementById("view_img_user");
            var root_node = xmldoc.querySelectorAll("imgUser");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var img = document.createElement("img");
                    img.src = root_node[i].childNodes[0].nodeValue;
                    view_img.appendChild(img);
                }
            }
        }
    },
    getYetImages: function () {
        var h = document.querySelector("#hiddenlistimg");
        var nextPage = parseInt(h.value) + 1;
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idPage", nextPage);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/getImagesUser", bagrequest.endGetYetImgUser, null);
        h.value = nextPage;
    },

    saveSelectImg: function (set_obj) {
        var event = baggeneral.fixEvent(event);
        var this_el = event.target || event.srcElement;
        if (this_el.tagName != "IMG") return;
        if (!this_el.getAttribute("src")) return;

        var url_img = this_el.getAttribute("src").replace(/(s)(\d+)(?=.[a-zA-Z]{1,4})/, "$2");
        var parent_img = document.getElementById(set_obj);
        if (set_obj == "list_style_image" || set_obj == "background_image") {
            parent_img.value = "url('" + url_img + "')";
            parent_img.onclick = bagcsseditor.insertCssCode;
            parent_img.click();
        }
        else {
            parent_img.value = url_img;
        }
        baggeneral.closeSubmenu("dialog_selectimage");
    },
        
    saveImg: function () {
        var array_file = document.getElementById("add_user_file").files;
        if (array_file.length > 0) {
            var view_user_file = document.getElementById("view_new_user_file");
            for (var i = 0; i < array_file.length; i++) {
                if (array_file[i].type == 'image/jpeg' || array_file[i].type == 'image/bmp' || array_file[i].type == 'image/png') {
                    if (array_file[i].size <= 10000000) {
                        var idDiv = new Date().getTime();
                        var load_div = document.createElement("div");
                        load_div.setAttribute("id", idDiv);
                        var img = document.createElement("img");
                        img.src = "/images/load.gif";
                        img.setAttribute("style", "width: 100px;");
                        load_div.appendChild(img);
                        var span = document.createElement("h2");
                        load_div.appendChild(span);
                        view_user_file.appendChild(load_div);
                        var formData = new FormData();
                        formData.append("file", array_file[i]);
                        bagrequest.saveImgSendReqest(formData, "POST", "/xml/general.asmx/saveTempImg", load_div, "img");
                    }
                    else
                        baggeneral.viewMessage("dialog_messageaddfile", "Размер файла не должен превышать 10 мб");
                }
                else
                    baggeneral.viewMessage("dialog_messageaddfile", "Допустимые разрешения файлов jpg, png, bmp");
            }
            baggeneral.centerDiv("dialog_newuserfile");
        }
        else {
            baggeneral.viewMessage("dialog_messageaddfile", "Выберите файлы для загрузки");
        }
    },
    saveImgSendReqest: function (fromdata, method, url_xml, load_div, typeFile) {
        var xmldoc = document.createElement("div");
        var request = bagrequest.getRequest();
        if (request) {
            request.open(method, url_xml, true);
            //request.setRequestHeader('Content-Type', 'multipart/form-data');
            request.onreadystatechange = function () {
                try {
                    if (request.readyState == 4) {
                        if (request.status == 200) {
                            xmldoc.innerHTML = request.responseText;
                            var root_node = xmldoc.querySelectorAll("error");
                            if (root_node.length > 0) {
                                baggeneral.viewMessage("dialog_messageError", root_node[0].childNodes[0].nodeValue);
                                load_div.parentNode.removeChild(load_div);
                                return false;
                            }
                            root_node = xmldoc.querySelectorAll("tempFile");
                            if (root_node.length > 0) {
                                load_div.innerHTML = "";
                                if (typeFile == "img") {
                                    var img = document.createElement("img");
                                    img.src = root_node[0].childNodes[0].nodeValue;
                                    img.setAttribute("style", "height: 100px;");
                                    load_div.appendChild(img);
                                }
                                else
                                    if (typeFile == "file") {
                                        var iFile = document.createElement("i");
                                        iFile.innerText = root_node[0].childNodes[0].nodeValue;
                                        load_div.appendChild(iFile);
                                        load_div.setAttribute("style", "float:none;");
                                    }
                                var span = document.createElement("span");
                                span.innerHTML = "Удалить";
                                span.setAttribute("onclick", "bagrequest.deleteTempImg('" + load_div.id + "')");
                                load_div.appendChild(span);
                            }
                        }
                        else {
                            request.abort();
                            load_div.parentNode.removeChild(load_div);
                            baggeneral.viewMessage("dialog_messageError", "С запросом возникла проблема.");
                        }
                    }
                }
                catch (e) {
                    request.abort();
                    load_div.parentNode.removeChild(load_div);
                    baggeneral.viewMessage("dialog_messageError", "Произошло исключение: " + e.description);
                }
            };
            request.upload.onprogress = function (e) {
                var h = load_div.querySelectorAll("h2")[0];
                h.innerHTML = Math.round(e.loaded / e.total * 100) + "%";
            }
            request.send(fromdata);
        }
    },
    deleteTempImg: function (idDiv) {
        if (document.getElementById(idDiv)) {
            var load_div = document.getElementById(idDiv);
            load_div.parentNode.removeChild(load_div);
        }
    },
    endSaveNewUserFile: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_newuserfile");
    },
    saveNewUserFile: function () {
        if (document.getElementById("view_new_user_file")) {
            var view_user_file = document.getElementById("view_new_user_file");
            var array_load_div = view_user_file.querySelectorAll("div");
            if (array_load_div.length > 0) {
                var name_file = "";
                for (var i = 0; i < array_load_div.length; i++) {
                    if (array_load_div[i].querySelectorAll("img").length > 0) {
                        var img = array_load_div[i].querySelectorAll("img")[0];
                        name_file += img.src.match(/\d+\.[a-zA-Z]{1,4}/)[0] + ";";
                    }
                }
                if (name_file) {
                    var formData = new FormData();
                    formData.append("arrayFile", name_file);
                    bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveNewUserFile", bagrequest.endSaveNewUserFile, null);
                }

            }


        }
    },    

    endUpdatePositionModule: function (xmldoc, args) {

    },
    updatePositionModule: function (id_module_array) {
        var formData = new FormData();
        formData.append("arrayModule", id_module_array);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/updatePosition", bagrequest.endUpdatePositionModule, null);
    },

    endAddExten: function (xmldoc, args) {
        if (xmldoc) {
            var view_exten = document.getElementById("view_exten");
            view_exten.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("exten");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var d = document.createElement("div");
                    d.setAttribute("class", "selectedContent");
                    var span = document.createElement("b");
                    span.innerText = root_node[i].querySelectorAll("nameExten")[0].childNodes[0].nodeValue;
                    d.appendChild(span);
                    span = document.createElement("p");
                    span.innerText = root_node[i].querySelectorAll("textExten")[0].childNodes[0].nodeValue;
                    d.appendChild(span);
                    d.setAttribute("id", root_node[i].querySelectorAll("idExten")[0].childNodes[0].nodeValue + "_exten");
                    d.setAttribute("onclick", "bagrequest.selectExten(this)");
                    view_exten.appendChild(d);

                }
            }
            else
                view_exten.innerText = "Нет расширений!";

        }
        baggeneral.centerDiv("dialog_addexten");
    },
    addExten: function (whereInsert) {

        var name_dialog = "dialog_addexten";
        var inner_html = "<div  id='view_exten'></div><input id='selectExten' type='hidden' value=''/>";

        var button_array = new Array();
        button_array.push({ "name": "Вставить", "func": "bagrequest.insertExten('" + whereInsert + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Расширения", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
                
        baggeneral.viewLoadingDiv();
        bagrequest.sendRequest(null, "POST", "/xml/general.asmx/getModule", bagrequest.endAddExten, null);

        baggeneral.centerDiv(name_dialog);

    },
    endInsertExten: function (xmldoc, args) {
        location.reload();
    },
    insertExten: function (whereInsert) {
        
        var id_exten = document.getElementById("selectExten").value;
        if (baggeneral.getPageId()!=null) {
            if (id_exten != "") {
                baggeneral.viewLoadingDiv();
                var formData = new FormData();
                formData.append("idExten", id_exten);
                formData.append("position", whereInsert);
                formData.append("page", baggeneral.getPageId());
                bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/addPageModule", bagrequest.endInsertExten, null);
                baggeneral.closeSubmenu("dialog_addexten");
            }
            else
                baggeneral.viewMessage("dialog_messageaddexten", "Выберите расширение для добавления на страницу.");
        }
        else {
            baggeneral.viewMessage("dialog_messageaddexten", "Не удалось получить идентификатор страницы!");
        }

    },
    selectExten: function (div) {
        document.getElementById("selectExten").value = div.id.split('_')[0];
        baggeneral.selectedActivDiv(div);
    },

    endSaveProperty: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_saveProperty");
    },
    saveProperty: function (idProperty) {
        var nameSave = document.getElementById("nameSaveProperty").value;
        if (nameSave != "") {
            var formData = new FormData();
            formData.append("nameSave", nameSave);
            formData.append("idProperty", idProperty);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveProperty", bagrequest.endSaveProperty, null);
        }
    },

    endGetSaveProperty: function (xmldoc, args) {
        if (xmldoc) {
            var view_property = document.getElementById("viewSaveProperty");
            view_property.innerHTML = "";
            var root_node = xmldoc.querySelectorAll("property");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    var d = document.createElement("div");
                    d.setAttribute("class", "selectedContent");
                    var span = document.createElement("p");
                    span.innerText = root_node[i].querySelectorAll("nameProperty")[0].childNodes[0].nodeValue;
                    d.appendChild(span);
                    d.setAttribute("id", root_node[i].querySelectorAll("idProperty")[0].childNodes[0].nodeValue + "_SaveProperty");
                    d.setAttribute("onclick", "bagrequest.selectSaveProperty(this)");
                    view_property.appendChild(d);

                }
            }
            else
                view_property.innerText = "Нет сохраненных настроек!";
            baggeneral.centerDiv("dialog_getSaveProperty");
        }
    },
    getSaveProperty: function (idProperty) {
        var name_dialog = "dialog_getSaveProperty";
        var inner_html = "<div id='viewSaveProperty'></div><input id='selectSaveProperty' type='hidden' value=''/>";

        var button_array = new Array();
        button_array.push({ "name": "Применить", "func": "bagrequest.appySaveProperty('" + idProperty + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Выбор настройки", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);

        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idProperty", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/getProperty", bagrequest.endGetSaveProperty, idProperty);


    },
    selectSaveProperty: function (div) {
        document.getElementById("selectSaveProperty").value = div.id.split('_')[0];
        baggeneral.selectedActivDiv(div);
    },
    endAppySaveProperty: function (xmldoc, args) {
        location.reload();
    },
    appySaveProperty: function (idProperty) {
        var selectSaveProperty = document.getElementById("selectSaveProperty");
        if (selectSaveProperty.value != "") {
            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("idSaveProperty", selectSaveProperty.value);
            formData.append("idProperty", idProperty);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/appySaveProperty", bagrequest.endAppySaveProperty, idProperty);
        }
        else
            baggeneral.viewMessage("dialog_messageaddproperty", "Выберите настройку для применения к объекту.");
    },

    endDeletePage: function (xmldoc, args) {
        location.reload();
    },
    startDeletePage: function (idPage) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idPage", idPage);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/deletePage", bagrequest.endDeletePage, null);
    },
    deletePage: function (idPage) {
        var name_dialog = "dialog_deletepage";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить", "func": "bagrequest.startDeletePage('" + idPage + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);
    },

    endSaveTemplates: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_newTemplates");
    },
    saveNewTemplates: function () {        
        if (baggeneral.getPageId()!=null) {
            var nameSave = document.getElementById("valueNewTemplates").value;
            if (nameSave != "") {
                baggeneral.viewLoadingDiv();
                var idPage = baggeneral.getPageId();
                var formData = new FormData();
                formData.append("idPage", idPage);
                formData.append("nameTemplate", nameSave);
                bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/saveTemplate", bagrequest.endSaveTemplates, null);
            }
            else
                baggeneral.viewMessage("dialog_messagesavetemplate", "Введите имя шаблона!");
        }
        else {
            baggeneral.viewMessage("dialog_messagesavetemplate", "Не удалось получить идентификатор страницы!");
        }
    },
    newTemplates: function () {
        var name_dialog = "dialog_newTemplates";
        var field_array = new Array();
        field_array.push({ "id": "valueNewTemplates", "type": "text", "name": "Имя шаблона", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "bagrequest.saveNewTemplates();" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Новый шаблон", field_array, button_array, null);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },

    endExitUser: function (xmldoc, args) {
        location.reload();
    },
    exitUser: function () {
        bagrequest.sendRequest(null, "POST", "/xml/general.asmx/exitUser", bagrequest.endExitUser, null);
    },

    endSendEmail: function (xmldoc, args) {
        if (xmldoc) {
            var root_node = xmldoc.querySelectorAll("message");
            if (root_node.length > 0) {
                if (document.getElementById("errorlogin")) {
                    document.getElementById("errorlogin").innerHTML = root_node[0].childNodes[0].nodeValue;;
                }
            }
        }
    },
    sendEmail: function (userEmail) {
        if (userEmail != "") {
            var formData = new FormData();
            formData.append("sendEmail", userEmail);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/sendEmail", bagrequest.endSendEmail, null);
        }
    },

    endSaveInfoUser: function (xmldoc, args) {
        var viewContent = document.getElementById(args + "_viewContent");
        var button = viewContent.querySelector("input[type=button]");
        var nextPage = button.getAttribute("data-page");
        location.href = nextPage;
    },
    saveInfoUser: function (idProperty) {
        var viewContent = document.getElementById(idProperty + "_viewContent");
        var arrayField = viewContent.querySelectorAll("input, select, textarea");
        var arrayValue = [];
        var bol = true;
        var span = null;
        for (var i = 0; i < arrayField.length; i++) {
            if (typeof bagRegexp[arrayField[i].id] != "undefined") {
                var arrayMessage = arrayField[i].parentNode.querySelectorAll("span");
                for (var b = 0; b < arrayMessage.length; b++) {
                    arrayField[i].parentNode.removeChild(arrayMessage[b]);
                }                
                if (bagRegexp[arrayField[i].id].isNull == "true" && arrayField[i].value == "") {
                    bol = false;
                    span = document.createElement("span");
                    span.innerHTML = "Обязательное поле!";
                    arrayField[i].parentNode.appendChild(span);
                }
                if (bagRegexp[arrayField[i].id].exp != "") {
                    var r = new RegExp(bagRegexp[arrayField[i].id].exp);
                    if (!r.test(arrayField[i].value)) {
                        bol = false;
                        span = document.createElement("span");
                        span.innerHTML = bagRegexp[arrayField[i].id].message;
                        arrayField[i].parentNode.appendChild(span);
                    }
                }
                arrayValue.push({ "id": arrayField[i].id, "value": arrayField[i].value });
            }
        }
        if (bol) {
            var formData = new FormData();
            formData.append("arrayValue", JSON.stringify(arrayValue));
            bagrequest.sendRequest(formData, "POST", "/xml/loadControl.asmx/saveInfoUser", bagrequest.endSaveInfoUser, idProperty);
        }
    },
};