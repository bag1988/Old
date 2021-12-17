var bagphoto = {

    endSaveNewPhoto: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageaddPhoto", "Записано, происходит обновление страницы.");
        baggeneral.closeSubmenu("dialog_newPhoto");
        location.reload();
    },
    saveNewPhoto: function (idPhoto) {

        var nameNewPhoto = document.getElementById("nameNewPhoto").value;
        var textNewPhoto = document.getElementById("textNewPhoto").value;

        if (nameNewPhoto != "") {
            var formData = new FormData();
            formData.append("newPhoto", nameNewPhoto);
            formData.append("textPhoto", textNewPhoto);
            formData.append("idPhoto", idPhoto);
            bagrequest.sendRequest(formData, "POST", "/admin/photo.aspx", bagphoto.endSaveNewPhoto, null);
        }
        else
            baggeneral.viewMessage("dialog_messageaddPhoto", "Поле 'Наименование категории' обязательно!!!");
    },
    addPhoto: function (idPhoto) {
        var name_dialog = "dialog_newPhoto";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "nameNewPhoto", "type": "text", "name": "Наименование категории", "value": "" });
        field_array.push({ "id": "textNewPhoto", "type": "textarea", "name": "Описание", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagphoto.saveNewPhoto('" + idPhoto + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Добавление категории", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        document.getElementById("textNewPhoto").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);

        if (idPhoto != -1) {
            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("getInfoPhoto", idPhoto);
            bagrequest.sendRequest(formData, "POST", "/admin/photo.aspx", bagphoto.endGetInfoPhoto, null);
        }
    },
    endGetInfoPhoto: function (xmldoc, args) {
        if (xmldoc) {
            var nameNewPhoto = document.getElementById("nameNewPhoto");
            var textNewPhoto = document.getElementById("textNewPhoto");
            var root_node = xmldoc.querySelectorAll("photo");
            if (root_node.length > 0) {
                nameNewPhoto.value = baggeneral.getNullValue(root_node[0].querySelectorAll("namePhoto"));
                textNewPhoto.value = baggeneral.getNullValue(root_node[0].querySelectorAll("textPhoto"));
            }
            else
                baggeneral.viewMessage("dialog_messageinfoPhoto", "Ошибка получения данных!");

        }
    },

    endSaveEditImg: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageEditImg", "Записано!");
        baggeneral.closeSubmenu("dialog_editImg");
    },
    saveEditImg: function (idImg) {
        var textEditImg = document.getElementById("textEditImg").value;
        var formData = new FormData();
        formData.append("textEditImg", textEditImg);
        formData.append("idImg", idImg);
        bagrequest.sendRequest(formData, "POST", "/admin/photo.aspx", bagphoto.endSaveEditImg, null);
    },
    editPhotoImg: function (idImg) {
        var name_dialog = "dialog_editImg";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var field_array = new Array();
        field_array.push({ "id": "textEditImg", "type": "textarea", "name": "Описание", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bagphoto.saveEditImg('" + idImg + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Редактирование свойств", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        document.getElementById("textEditImg").setAttribute("style", "min-width:200px; min-height: 100px;");
        baggeneral.centerDiv(name_dialog);

        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("getInfoImg", idImg);
        bagrequest.sendRequest(formData, "POST", "/admin/photo.aspx", bagphoto.endGetInfoImg, null);
    },
    endGetInfoImg: function (xmldoc, args) {
        if (xmldoc) {
            var textEditImg = document.getElementById("textEditImg");
            var root_node = xmldoc.querySelectorAll("textImg");
            if (root_node.length > 0) {
                textEditImg.value = baggeneral.getNullValue(root_node[0].querySelectorAll("text"));
            }            
        }
    },
    
    NewUserImg: function (idPhoto) {
        var name_dialog = "dialog_newuserfile";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div class='newuserfile' id='view_new_user_file'></div><input onchange='bagrequest.saveImg();' id='add_user_file' multiple='multiple' type='file' />";

        var button_array = new Array();
        button_array.push({ "name": "Очистить", "func": "baggeneral.closeSubmenu('" + name_dialog + "'); bagphoto.NewUserImg('" + idPhoto + "');" });
        button_array.push({ "name": "Добавить", "func": "bagphoto.saveNewUserFile('" + idPhoto + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Загрузка файлов", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },
    endSaveNewUserFile: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_newuserfile");
        location.reload();
    },
    saveNewUserFile: function (idPhoto) {
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
                    formData.append("array_file", name_file);
                    formData.append("idPhoto", idPhoto);
                    bagrequest.sendRequest(formData, "POST", "/admin/photo.aspx", bagphoto.endSaveNewUserFile, null);
                }
            }
        }
    },


    endDeleteImg: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageDeleteImg", "Обновление страницы.");
        baggeneral.closeSubmenu("dialog_deleteImg");
        location.reload();
    },
    startDeleteImg: function (idImg, boolFile) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("deleteIdImg", idImg);
        formData.append("boolFile", boolFile);
        bagrequest.sendRequest(formData, "POST", "/admin/photo.aspx", bagphoto.endDeleteImg, null);
    },
    deleteImg: function (idImg) {
        var name_dialog = "dialog_deleteImg";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить запись", "func": "bagphoto.startDeleteImg('" + idImg + "', 'false');" });
        button_array.push({ "name": "Полное удаление", "func": "bagphoto.startDeleteImg('" + idImg + "', 'true');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);
    },

    endDeletePhoto: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageDeletePhoto", "Обновление страницы.");
        baggeneral.closeSubmenu("dialog_deletePhoto");
        location.reload();
    },
    startDeletePhoto: function (idPhoto, boolFile) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("deleteIdPhoto", idPhoto);
        formData.append("boolFile", boolFile);
        bagrequest.sendRequest(formData, "POST", "/admin/photo.aspx", bagphoto.endDeletePhoto, null);
    },
    deletePhoto: function (idPhoto) {
        var name_dialog = "dialog_deletePhoto";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить запись", "func": "bagphoto.startDeletePhoto('" + idPhoto + "', 'false');" });
        button_array.push({ "name": "Полное удаление", "func": "bagphoto.startDeletePhoto('" + idPhoto + "', 'true');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);
    },

};