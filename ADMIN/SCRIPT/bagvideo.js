var bagvideo = {

    endSaveNewVideo: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageaddVideo", "Записано, происходит обновление страницы.");
        baggeneral.closeSubmenu("dialog_newVideo");
        location.reload();
    },
    saveNewVideo: function (idVideo) {

        var nameNewVideo = document.getElementById("nameNewVideo").value;
        var textNewVideo = document.getElementById("textNewVideo").value;

        if (nameNewVideo != "") {
            var formData = new FormData();
            formData.append("newVideo", nameNewVideo);
            formData.append("textVideo", textNewVideo);
            formData.append("idVideo", idVideo);
            bagrequest.sendRequest(formData, "POST", "/admin/video.aspx", bagvideo.endSaveNewVideo, null);
        }
        else
            baggeneral.viewMessage("dialog_messageaddVideo", "Поле 'Наименование категории' обязательно!!!");
    },
    addVideo: function (idVideo) {
        var name_dialog = "dialog_newVideo";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "nameNewVideo", "type": "text", "name": "Наименование категории", "value": "" });
        field_array.push({ "id": "textNewVideo", "type": "textarea", "name": "Описание", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagvideo.saveNewVideo('" + idVideo + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Добавление категории", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        document.getElementById("textNewVideo").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);

        if (idVideo != -1) {
            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("getInfoVideo", idVideo);
            bagrequest.sendRequest(formData, "POST", "/admin/video.aspx", bagvideo.endGetInfoVideo, null);
        }
    },
    endGetInfoVideo: function (xmldoc, args) {
        if (xmldoc) {
            var nameNewVideo = document.getElementById("nameNewVideo");
            var textNewVideo = document.getElementById("textNewVideo");
            var root_node = xmldoc.querySelectorAll("video");
            if (root_node.length > 0) {
                nameNewVideo.value = baggeneral.getNullValue(root_node[0].querySelectorAll("nameVideo"));
                textNewVideo.value = baggeneral.getNullValue(root_node[0].querySelectorAll("textVideo"));
            }
            else
                baggeneral.viewMessage("dialog_messageinfoVideo", "Ошибка получения данных!");

        }
    },

    endSaveEditList: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageEditList", "Записано!");
        baggeneral.closeSubmenu("dialog_editList");
    },
    saveEditList: function (idList) {
        var textEditList = document.getElementById("textEditList").value;
        var formData = new FormData();        
        formData.append("textEditList", textEditList);
        formData.append("idList", idList);
        bagrequest.sendRequest(formData, "POST", "/admin/video.aspx", bagvideo.endSaveEditList, null);
    },
    editVideoList: function (idList) {
        var name_dialog = "dialog_editList";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "textEditList", "type": "textarea", "name": "Описание", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagvideo.saveEditList('" + idList + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Редактирование свойств", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        document.getElementById("textEditList").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);

        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("getInfoList", idList);
        bagrequest.sendRequest(formData, "POST", "/admin/video.aspx", bagvideo.endGetInfoList, null);
    },
    endGetInfoList: function (xmldoc, args) {
        if (xmldoc) {
            var textEditList = document.getElementById("textEditList");
            var root_node = xmldoc.querySelectorAll("textList");
            if (root_node.length > 0) {
                textEditList.value = baggeneral.getNullValue(root_node[0].querySelectorAll("text"));
            }            
        }
    },
    
    endSaveNewVideoList: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageaddVideo", "Записано, происходит обновление страницы.");
        baggeneral.closeSubmenu("dialog_newVideoList");
        location.reload();
    },
    saveNewVideoList: function (idVideo) {

        var urlNewVideo = document.getElementById("urlNewVideoList").value;
        var textNewVideo = document.getElementById("textNewVideoList").value;

        if (urlNewVideo != "") {
            var formData = new FormData();
            formData.append("urlVideoList", urlNewVideo);
            formData.append("textVideoList", textNewVideo);
            formData.append("idVideo", idVideo);
            bagrequest.sendRequest(formData, "POST", "/admin/video.aspx", bagvideo.endSaveNewVideoList, null);
        }
        else
            baggeneral.viewMessage("dialog_messageaddVideo", "Поле 'Адрес видео' обязательно!!!");
    },
    addVideoList: function(idVideo)
    {
        var name_dialog = "dialog_newVideoList";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "urlNewVideoList", "type": "text", "name": "Адрес видео", "value": "" });
        field_array.push({ "id": "textNewVideoList", "type": "textarea", "name": "Описание", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagvideo.saveNewVideoList('" + idVideo + "');" });
        button_array.push({ "name": "Загрузить", "func": "bagvideo.openDialogNewFile('urlNewVideoList');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Добавление видео", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        document.getElementById("textNewVideoList").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);
    },


    saveFile: function () {
        var array_file = document.getElementById("add_user_file").files;
        if (array_file.length > 0) {
            var view_user_file = document.getElementById("view_new_user_file");
            for (var i = 0; i < array_file.length; i++) {
                if (array_file[i].size <= 500000000) {
                    var idDiv = new Date().getTime();
                    var load_div = document.createElement("div");
                    load_div.setAttribute("id", idDiv);
                    var img = document.createElement("img");
                    img.src = "/images/load.gif";
                    img.setAttribute("style", "width: 100px;");
                    img.setAttribute("align", "center");
                    load_div.setAttribute("style", "float:none;");
                    load_div.appendChild(img);
                    var span = document.createElement("h2");
                    load_div.appendChild(span);
                    view_user_file.appendChild(load_div);
                    var formData = new FormData();
                    formData.append("file", array_file[i]);
                    bagrequest.saveImgSendReqest(formData, "POST", "/admin/video.aspx", load_div, "file");
                }
                else
                    baggeneral.viewMessage("dialog_messageaddfile", "Размер файла не должен превышать 500 мб");
            }
            baggeneral.centerDiv("dialog_newfile");
        }
        else {
            baggeneral.viewMessage("dialog_messageaddfile", "Выберите файлы для загрузки");
        }
    },
    openDialogNewFile: function (idreturnfile) {
        var name_dialog = "dialog_newfile";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div class='newuserfile' id='view_new_user_file'></div><input onchange='bagvideo.saveFile();' id='add_user_file' type='file' />";

        var button_array = new Array();
        button_array.push({ "name": "Очистить", "func": "baggeneral.closeSubmenu('" + name_dialog + "'); bagvideo.openDialogNewFile('" + idreturnfile + "');" });
        button_array.push({ "name": "Добавить", "func": "bagvideo.saveNewFile('" + idreturnfile + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Загрузка файлов", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },
    saveNewFile: function (idreturnfile) {
        if (document.getElementById("view_new_user_file")) {
            var view_user_file = document.getElementById("view_new_user_file");
            var array_load_div = view_user_file.querySelectorAll("div");
            if (array_load_div.length > 0) {
                var name_file = "";
                for (var i = 0; i < array_load_div.length; i++) {
                    if (array_load_div[i].querySelectorAll("i").length > 0) {
                        var iFile = array_load_div[i].querySelectorAll("i")[0];
                        name_file = iFile.innerText;
                    }
                }
                if (name_file) {
                    if (document.getElementById(idreturnfile))
                        document.getElementById(idreturnfile).value ="http://river-riders.ru"+name_file;
                    baggeneral.closeSubmenu("dialog_newfile");
                }

            }
        }
    },


    endDeleteList: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageDeleteList", "Обновление страницы.");
        baggeneral.closeSubmenu("dialog_deleteList");
        location.reload();
    },
    startDeleteList: function (idList, boolFile) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("deleteIdList", idList);
        formData.append("boolFile", boolFile);
        bagrequest.sendRequest(formData, "POST", "/admin/video.aspx", bagvideo.endDeleteList, null);
    },
    deleteList: function (idList) {
        var name_dialog = "dialog_deleteList";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить запись", "func": "bagvideo.startDeleteList('" + idList + "', 'false');" });
        button_array.push({ "name": "Полное удаление", "func": "bagvideo.startDeleteList('" + idList + "', 'true');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);
    },

    endDeleteVideo: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageDeleteVideo", "Обновление страницы.");
        baggeneral.closeSubmenu("dialog_deleteVideo");
        location.reload();
    },
    startDeleteVideo: function (idVideo, boolFile) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("deleteIdVideo", idVideo);
        formData.append("boolFile", boolFile);
        bagrequest.sendRequest(formData, "POST", "/admin/video.aspx", bagvideo.endDeleteVideo, null);
    },
    deleteVideo: function (idVideo) {
        var name_dialog = "dialog_deleteVideo";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить запись", "func": "bagvideo.startDeleteVideo('" + idVideo + "', 'false');" });
        button_array.push({ "name": "Полное удаление", "func": "bagvideo.startDeleteVideo('" + idVideo + "', 'true');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);
    },

};