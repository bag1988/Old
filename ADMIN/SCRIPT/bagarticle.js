var bagarticle = {
    endDeleteArticle: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageDeleteArticle", "Обновление страницы.");
        baggeneral.closeSubmenu("dialog_deleteArticle");
        location.reload();
    },
    startDeleteArticle: function (idArticle) {
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("deleteArticle", idArticle);
        bagrequest.sendRequest(formData, "POST", "/admin/Article.aspx", bagarticle.endDeleteArticle, null);
    },
    deleteArticle: function (idArticle) {
        var name_dialog = "dialog_deletenews";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<font styke='color:red;'>ВНИМАНИЕ!!! Отменить данное действие будет невозможно!<br/> Подтвердите удаление.<font>";

        var button_array = new Array();
        button_array.push({ "name": "Удалить", "func": "bagarticle.startDeleteArticle('" + idArticle + "');" });
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

    endSaveNewArticle: function (xmldoc, args) {
        baggeneral.viewMessage("dialog_messageaddArticle", "Записано!");
    },
    saveNewArticle: function (idArticle) {
        var name_txt = document.getElementById("name_txt").value;
        var short_txt = document.getElementById("short_txt").value;
        var text_html = document.getElementById("text_html").innerHTML;
        var key_txt = document.getElementById("key_txt").value;
        text_html = text_html.replace(/</g, "&lt;");
        text_html = text_html.replace(/>/g, "&gt;");

        if (name_txt != "" && short_txt != "" && text_html != "") {
            var formData = new FormData();
            formData.append("nameArticle", name_txt);
            formData.append("shortArticle", short_txt);
            formData.append("textArticle", text_html);
            formData.append("keywordArticle", key_txt);
            formData.append("Article", idArticle);
            bagrequest.sendRequest(formData, "POST", "/admin/editArticle.aspx", bagarticle.endSaveNewArticle, null);
        }
        else
            baggeneral.viewMessage("dialog_messageaddArticle", "Заполните все поля!");
    },
};