var bageditor = {
    eRange: null,
    idTextBox: null,
    oldText: null,

    insertIframe: function (id_span) {
        if (bageditor.idTextBox)
            bageditor.refreshEditor();
        bageditor.idTextBox = id_span;
        bageditor.editorLoaded();
    },

    editorLoaded: function () {
        var this_editor = document.getElementById(bageditor.idTextBox + "_viewContent");
        bageditor.oldText = this_editor.innerHTML;
        this_editor.setAttribute("contenteditable", "true");
        this_editor.setAttribute("onkeyup", "bageditor.getSelectionRange()");
        this_editor.setAttribute("onmouseup", "bageditor.getSelectionRange()");
        this_editor.setAttribute("onmousedown", "bageditor.getSelectionRange()");
        var editor_normal = document.getElementById("editor_normal");
        editor_normal.innerHTML = baggeteditor.geteditortext().innerHTML;        
        bageditor.showHideMenu(false);        
        var textarea = document.createElement("textarea");
        textarea.setAttribute("id", bageditor.idTextBox + "_edited_html");
        textarea.setAttribute("name", bageditor.idTextBox + "_edited_html");
        textarea.setAttribute("style", "width:100%; border:none; display: none; min-height: 50px;");
        var container_div = document.getElementById(bageditor.idTextBox + "_container");
        document.getElementById(bageditor.idTextBox + "_edit").setAttribute("style", "background-color:#ff4200;");
        container_div.appendChild(textarea);
        bageditor.setColor("#000000");
        baggeneral.loadAdminPanel();
    },    

    getSelectionRange: function () {
        if (typeof window.getSelection != "undefined") {
            bageditor.eRange = window.getSelection().getRangeAt(0);
        }
        else
            if (typeof document.selection != "undefined" && document.selection.type != "Control") {
                bageditor.eRange = document.selection.createRange();
            }
            else {
                baggeneral.viewMessage("dialog_messagegetrange", "Браузер не поддерживает эту функцию");
                bageditor.eRange = false;
            }
    },

    refreshEditor: function () {
        var text_box = document.getElementById(bageditor.idTextBox + "_viewContent");
        text_box.innerHTML = bageditor.oldText;
        document.getElementById(bageditor.idTextBox + "_edited_html").style.display = "none";
        text_box.style.display = "block";
        bageditor.removeIframe();
    },

    showHideMenu: function (show_hide) {
        if (document.getElementById(bageditor.idTextBox + "_menu_module")) {
            var menu = document.getElementById(bageditor.idTextBox + "_menu_module");
            var parent_menu = menu.parentNode;

            if (!show_hide) {
                document.getElementById("editor_normal").style.display = "block";
                menu.style.display = "none";
                var dl = document.createElement("dl");
                dl.setAttribute("id", bageditor.idTextBox + "_editor_menu");

                var dt = document.createElement("dt");
                dt.innerText = "Сохранить";
                dt.setAttribute("onclick", "bagrequest.saveChanges(); bageditor.removeIframe();");
                dl.appendChild(dt);

                dt = document.createElement("dt");
                dt.innerText = "Просмотр html";
                dt.setAttribute("onclick", "bageditor.showNormal();");
                dl.appendChild(dt);

                dt = document.createElement("dt");
                dt.innerText = "Просмотр кода";
                dt.setAttribute("onclick", "bageditor.showHtml();");
                dl.appendChild(dt);

                dt = document.createElement("dt");
                dt.innerText = "Отмена";
                dt.setAttribute("onclick", "bageditor.refreshEditor();");
                dl.appendChild(dt);

                parent_menu.appendChild(dl);
            }
            else {
                menu.removeAttribute("style");
                var ul = document.getElementById(bageditor.idTextBox + "_editor_menu");
                parent_menu.removeChild(ul);
                document.getElementById("editor_normal").style.display = "none";
            }
        }
    },

    removeIframe: function () {
        var text_box = document.getElementById(bageditor.idTextBox + "_viewContent");
        var textarea;
        if (document.getElementById(bageditor.idTextBox + "_edited_html")) {
            textarea = document.getElementById(bageditor.idTextBox + "_edited_html");
            if (textarea.style.display == "block") {
                text_box.innerHTML = textarea.value;
            }
            var container_editor = document.getElementById(bageditor.idTextBox + "_container");
            container_editor.removeChild(textarea);
        }
        document.getElementById(bageditor.idTextBox + "_edit").removeAttribute("style");
        text_box.style.display = "block";
        text_box.removeAttribute("contenteditable");
        bageditor.showHideMenu(true);
        bageditor.idTextBox = null;
        bageditor.oldText = null;
        bageditor.eRange = null;
        baggeneral.loadAdminPanel();
    },

    showHtml: function () {
        var textarea = document.getElementById(bageditor.idTextBox + "_edited_html");
        if (textarea.style.display == "none") {
            textarea.style.height = document.getElementById(bageditor.idTextBox + "_viewContent").offsetHeight + "px";
            var this_editor = document.getElementById(bageditor.idTextBox + "_viewContent");
            this_editor.style.display = "none";
            textarea.value = this_editor.innerHTML;
            textarea.style.display = "block";
            textarea.focus();
        }
    },

    showNormal: function () {
        var this_editor = document.getElementById(bageditor.idTextBox + "_viewContent");
        if (this_editor.style.display == "none") {
            var textarea = document.getElementById(bageditor.idTextBox + '_edited_html');
            textarea.style.display = "none";
            this_editor.style.display = "block";
            this_editor.innerHTML = textarea.value;
        }
    },

    setColor: function (color) {
        var array_img = document.getElementById("editor_normal").querySelectorAll("img");
        for (var i = 0; i < array_img.length; i++) {
            if (array_img[i].getAttribute("title") == "Цвет шрифта") {
                array_img[i].style.backgroundColor = color;
                break;
            }
        }
        document.getElementById("editor_fontcolor").value = color;
        bageditor.formatText('forecolor', color);
    },

    insertColor: function () {
        bageditor.formatText('forecolor', document.getElementById("editor_fontcolor").value);
    },

    formatText: function (command, option) {
        if (bageditor.eRange) {
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(bageditor.eRange);
            document.execCommand(command, false, option);
        }
    },

    setHtml: function (html) {
        if (bageditor.eRange && bageditor.eRange.pasteHTML) {            
            bageditor.eRange.pasteHTML(html);
        } else {            
            bageditor.eRange.deleteContents();
            var el = document.createElement("mainedit");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            bageditor.eRange.insertNode(frag);
            
            if (lastNode) {
                var selection = window.getSelection();
                bageditor.eRange = bageditor.eRange.cloneRange();
                bageditor.eRange.setStartAfter(lastNode);
                bageditor.eRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(bageditor.eRange);
            }
            

        }
    },

    createLink: function () {
        var new_link = document.getElementById("adress_new_link").value;
        if (new_link)
            bageditor.formatText("CreateLink", new_link);
    },

    insertTable: function () {
        CTD = '';
        for (i = 0; i < document.getElementById("editor_addtable_cols").value; i++) {
            CTD = CTD + '<td>&nbsp;</td>';
        }
        CTR = '';
        for (i = 0; i < document.getElementById("editor_addtable_rows").value; i++) {
            CTR = CTR + '<tr>' + CTD + '</tr>';
        }
        bageditor.setHtml('<table width=' + document.getElementById("editor_addtable_width").value + ' border=' + document.getElementById("editor_addtable_border").value + '>' + CTR + '</table>');
    },

    getParent: function (tag) {
        if (document.selection) {
            var obj = bageditor.eRange.parentElement();
            while (obj.tagName != tag && obj.tagName != "BODY") {
                obj = obj.parentElement;
            }
            if (obj.tagName == "BODY") {
                return null;
            } else {
                return obj;
            }
        } else if (bageditor.eRange.startContainer) {
            startRangeNode = bageditor.eRange.startContainer;
            var obj = startRangeNode.parentNode;
            while (obj.nodeName != tag && obj.nodeName != "BODY") {
                obj = obj.parentNode;
            }
            if (obj.tagName == "BODY") {
                return null;
            } else {
                return obj;
            }
        } else {
            baggeneral.viewMessage("dialog_messagegetrange", "Браузер не поддерживает эту функцию");
            return null;
        }
    },

    insertCol: function () {
        td = bageditor.getParent('TD');
        if (td != null) {
            pos = td.cellIndex;
            table = bageditor.getParent('TABLE');
            for (i = 0; i < table.rows.length; i++) {
                td = table.rows[i].insertCell(pos);
                td.innerHTML = "&nbsp;";
            }
        }
    },

    deleteCol: function () {
        td = bageditor.getParent('TD');
        if (td != null) {
            pos = td.cellIndex;
            table = bageditor.getParent('TABLE');
            for (i = 0; i < table.rows.length; i++) {
                td = table.rows[i].deleteCell(pos);
            }
        }
    },

    insertRow: function () {
        table = bageditor.getParent('TABLE');
        if (table != null) {
            tr = bageditor.getParent('TR');
            newtr = table.insertRow(tr.rowIndex);
            for (i = 0; i < tr.cells.length; i++) {
                td = newtr.insertCell(i);
                td.innerHTML = "&nbsp;";
            }
        }
    },

    deleteRow: function () {
        tr = bageditor.getParent('TR');
        if (tr != null) {
            table = bageditor.getParent('TABLE');
            table.deleteRow(tr.rowIndex);

        }
    },

    splitCell: function () {
        td = bageditor.getParent('TD');
        if (td != null) {
            tr = bageditor.getParent('TR');
            pos = td.cellIndex;
            newtd = tr.insertCell(pos + 1);
            newtd.innerHTML = "&nbsp;";
            table = bageditor.getParent('TABLE');
            for (i = 0; i < table.rows.length; i++) {
                if (i != tr.rowIndex && table.rows[i].cells[pos]) {
                    table.rows[i].cells[pos].colSpan += 1;
                }
            }
        }
    },

    setCell: function () {
        if ((bageditor.eRange != null) && (bageditor.eRange.tagName == 'TD')) {
            bageditor.eRange.width = document.getElementById("editor_cell_width").value;
            bageditor.eRange.height = document.getElementById("editor_cell_height").value;
        }
        bageditor.eRange = null;
    },

    insertImg: function () {
        var url_img = document.getElementById("url_new_img").value;
        var width_img = document.getElementById("width_img").value;
        var height_img = document.getElementById("height_img").value;
        var alt_img = document.getElementById("alt_img").value;
        var align_img = document.getElementById("align_img").value;
        if (url_img != "") {
            bageditor.setHtml("<img src='" + url_img + "' width='" + width_img + "' height='" + height_img + "' alt='" + alt_img + "' align='" + align_img + "'>");
            baggeneral.closeSubmenu("dialog_addimg");
        }
    },

    dialogAddImg: function () {
        var name_dialog = "dialog_addimg";
        var field_array = new Array();
        field_array.push({ "id": "url_new_img", "type": "text", "name": "URL адрес", "value": "" });
        field_array.push({ "id": "width_img", "type": "text", "name": "Ширина", "value": "" });
        field_array.push({ "id": "height_img", "type": "text", "name": "Высота", "value": "" });
        field_array.push({ "id": "alt_img", "type": "text", "name": "Описание", "value": "" });
        field_array.push({ "id": "align_img", "type": "select", "name": "Выравнивание", "value": "center:По центру;left:По левому краю;right:По правому краю" });

        var button_array = new Array();
        button_array.push({ "name": "Выбор изображения", "func": "baggeneral.openDialogSelectImage('url_new_img');" });
        button_array.push({ "name": "Добавить", "func": "bageditor.insertImg();" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Вставка изображения", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },

    dialogAddTable: function () {
        var name_dialog = "dialog_addtable";
        var field_array = new Array();
        field_array.push({ "id": "editor_addtable_cols", "type": "text", "name": "Количество столбцов", "value": "3" });
        field_array.push({ "id": "editor_addtable_rows", "type": "text", "name": "Количество строк", "value": "3" });
        field_array.push({ "id": "editor_addtable_width", "type": "text", "name": "Ширина таблицы", "value": "100%" });
        field_array.push({ "id": "editor_addtable_border", "type": "text", "name": "Толщина границ", "value": "0" });

        var button_array = new Array();
        button_array.push({ "name": "Вставить", "func": "bageditor.insertTable(); baggeneral.closeSubmenu('" + name_dialog + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
        var submenu = baggeneral.createSubmenu(name_dialog, "Вставка таблицы", field_array, button_array, null);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },

    dialogPropCell: function () {

        td = bageditor.getParent('TD');
        if (td != null) {
            bageditor.eRange = td;
            var name_dialog = "dialog_propcell";
            var field_array = new Array();
            field_array.push({ "id": "editor_cell_width", "type": "text", "name": "Ширина", "value": "" });
            field_array.push({ "id": "editor_cell_height", "type": "text", "name": "Высота", "value": "" });

            var button_array = new Array();
            button_array.push({ "name": "Применить", "func": "bageditor.setCell(); baggeneral.closeSubmenu('" + name_dialog + "');" });
            button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });
            var submenu = baggeneral.createSubmenu(name_dialog, "Свойства ячейки", field_array, button_array, null);
            submenu.setAttribute("class", "view_submenu");
            submenu.style.display = "block";
            baggeneral.centerDiv(name_dialog);
            document.getElementById("editor_cell_width").value = td.width;
            document.getElementById("editor_cell_height").value = td.height;
        }
    },

    dialogAddLink: function () {
        var name_dialog = "dialog_addlink";
        var field_array = new Array();
        field_array.push({ "id": "adress_new_link", "type": "text", "name": "Адрес ссылки:", "value": "http://" });

        var button_array = new Array();
        button_array.push({ "name": "Вставить", "func": "bageditor.createLink(); baggeneral.closeSubmenu('" + name_dialog + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Вставка ссылки", field_array, button_array, null);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },

    dialogAddHtml: function () {
        var name_dialog = "dialog_addhtml";
        var field_array = new Array();
        field_array.push({ "id": "editor_addhtml", "type": "textarea", "name": "", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Добавить", "func": "bageditor.setHtml(document.all.editor_addhtml.value); baggeneral.closeSubmenu('" + name_dialog + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Вставка html-кода", field_array, button_array, null);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },

    dialogAddSymbols: function () {
        var symbolArray = new Array();
        symbolArray.push({ "value": "&#162;" });
        symbolArray.push({ "value": "&#163;" });
        symbolArray.push({ "value": "&#165;" });
        symbolArray.push({ "value": "€" });
        symbolArray.push({ "value": "™" });
        symbolArray.push({ "value": "©" });
        symbolArray.push({ "value": "®" });
        symbolArray.push({ "value": "§" });
        symbolArray.push({ "value": "‰" });
        symbolArray.push({ "value": "–" });
        symbolArray.push({ "value": "—" });
        symbolArray.push({ "value": "«" });
        symbolArray.push({ "value": "»" });
        symbolArray.push({ "value": "…" });
        symbolArray.push({ "value": "±" });
        symbolArray.push({ "value": "&#188;" });
        symbolArray.push({ "value": "&#189;" });
        symbolArray.push({ "value": "&#190;" });
        symbolArray.push({ "value": "&#215;" });
        symbolArray.push({ "value": "&#247;" });
        symbolArray.push({ "value": "&#8592;" });
        symbolArray.push({ "value": "&#8593;" });
        symbolArray.push({ "value": "&#8594;" });
        symbolArray.push({ "value": "&#8595;" });
        symbolArray.push({ "value": "&#8596;" });
        symbolArray.push({ "value": "&#8721;" });
        symbolArray.push({ "value": "&#8734;" });
        symbolArray.push({ "value": "&#8745;" });
        symbolArray.push({ "value": "&#8800;" });
        symbolArray.push({ "value": "&#8801;" });
        symbolArray.push({ "value": "&#8804;" });
        symbolArray.push({ "value": "&#8805;" });

        var divSymbols = document.createElement("div");
        for (var i = 0; i < symbolArray.length; i++) {
            var span = document.createElement("span");
            span.setAttribute("onclick", "bageditor.setHtml('" + symbolArray[i].value + "')");
            span.innerHTML = symbolArray[i].value;
            divSymbols.appendChild(span);
        }

        var name_dialog = "dialog_addsymbols";
        var inner_html = "<div class='div_submenu'>" + divSymbols.innerHTML + "</div>";

        var button_array = new Array();
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Выбор символа", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    }, 
    
};