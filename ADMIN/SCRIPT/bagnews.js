var bagnews = {
    endDeleteNews: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageDeleteNews", "Обновление страницы.");
        baggeneral.closeSubmenu("dialog_deletenews");
        location.reload();
    },
    startDeleteNews: function (idNews) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("deleteNews", idNews);
        bagrequest.sendRequest(formData, "POST", "/admin/news.aspx", bagnews.endDeleteNews, null);
    },
    deleteNews: function (idNews) {
        var name_dialog = "dialog_deletenews";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить", "func": "bagnews.startDeleteNews('" + idNews + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Предупреждение", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);
    },

    insertIframe: function () {
        var this_editor = document.getElementById("text_html");       
        this_editor.setAttribute("contenteditable", "true");
        this_editor.setAttribute("onkeyup", "bageditor.getSelectionRange()");
        this_editor.setAttribute("onmouseup", "bageditor.getSelectionRange()");
        this_editor.setAttribute("onmousedown", "bageditor.getSelectionRange()");
        var editor_normal = document.getElementById("editor_normal");
        editor_normal.innerHTML = baggeteditor.geteditortext().innerHTML;        
        bageditor.setColor("#000000");
    },

    endSaveNewNews: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageaddNews", "Записано!");
    },
    saveNewNews: function (idNews) {
        var name_txt = document.getElementById("name_txt").value;
        var short_txt = document.getElementById("short_txt").value;
        var text_html = document.getElementById("text_html").innerHTML;
        var key_txt = document.getElementById("key_txt").value;
        text_html = text_html.replace(/</g, "&lt;");
        text_html = text_html.replace(/>/g, "&gt;");

        if (name_txt != "" && short_txt != "" && text_html != "") {
            var formData = new FormData();
            formData.append("nameNews", name_txt);
            formData.append("shortNews", short_txt);
            formData.append("textNews", text_html);
            formData.append("keywordNews", key_txt);
            formData.append("News", idNews);
            bagrequest.sendRequest(formData, "POST", "/admin/editNews.aspx", bagnews.endSaveNewNews, null);
        }
        else
            baggeneral.viewMessage("dialog_messageaddNews", "Заполните все поля!");
    },
};