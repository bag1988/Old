var bagfile = {    
    saveFile: function (typeFile) {
        var array_file = document.getElementById("add_user_file").files;
        if (array_file.length > 0) {
            var view_user_file = document.getElementById("view_new_user_file");
            for (var i = 0; i < array_file.length; i++) {
                if (array_file[i].size <= 10000000) {
                    var idDiv = new Date().getTime();
                    var load_div = document.createElement("div");
                    load_div.setAttribute("id", idDiv);
                    var img = document.createElement("img");
                    img.src = "/images/load.gif";
                    img.setAttribute("style", "width: 100px;");
                    if (typeFile == "file") {
                        img.setAttribute("align", "center");
                        load_div.setAttribute("style", "float:none;");
                    }
                    load_div.appendChild(img);
                    var span = document.createElement("h2");
                    load_div.appendChild(span);
                    view_user_file.appendChild(load_div);
                    var formData = new FormData();
                    formData.append("file", array_file[i]);
                    formData.append("typeFile", typeFile);
                    bagrequest.saveImgSendReqest(formData, "POST", "/admin/extend.aspx", load_div, typeFile);
                }
                else
                    baggeneral.viewMessage("dialog_messageaddfile", "Размер файла не должен превышать 10 мб");
            }
            baggeneral.centerDiv("dialog_newfile");
        }
        else {
            baggeneral.viewMessage("dialog_messageaddfile", "Выберите файлы для загрузки");
        }
    },
    openDialogNewFile: function (typeFile) {
        var name_dialog = "dialog_newfile";
        var inner_html = "<div class='newuserfile' id='view_new_user_file'></div><input onchange=\"bagfile.saveFile('" + typeFile + "');\" id='add_user_file' multiple='multiple' type='file' />";

        var button_array = new Array();
        button_array.push({ "name": "Очистить", "func": "baggeneral.closeSubmenu('" + name_dialog + "'); bagfile.openDialogNewFile('" + typeFile + "');" });
        button_array.push({ "name": "Добавить", "func": "bagfile.saveNewFile('" + typeFile + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Загрузка файлов", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },
    saveNewFile: function (typeFile) {
        if (document.getElementById("view_new_user_file")) {
            var view_user_file = document.getElementById("view_new_user_file");
            var array_load_div = view_user_file.querySelectorAll("div");
            if (array_load_div.length > 0) {
                var name_file = "";
                for (var i = 0; i < array_load_div.length; i++) {
                    if (typeFile == "img") {
                        if (array_load_div[i].querySelectorAll("img").length > 0) {
                            var img = array_load_div[i].querySelectorAll("img")[0];
                            name_file += img.src.match(/\d+\.[a-zA-Z]{1,4}/)[0] + ";";
                        }
                    }
                    if (typeFile == "file") {
                        if (array_load_div[i].querySelectorAll("i").length > 0) {
                            var iFile = array_load_div[i].querySelectorAll("i")[0];
                            name_file += iFile.innerText + ";";
                        }
                    }
                }
                if (name_file) {
                    if (typeFile == "img") {
                        if (document.getElementById("imgNewExten"))
                            document.getElementById("imgNewExten").value = name_file;
                    }
                    if (typeFile == "file") {
                        if (document.getElementById("fileNewExten"))
                            document.getElementById("fileNewExten").value = name_file;
                    }
                    baggeneral.closeSubmenu("dialog_newfile");
                }

            }
        }
    },
};