var bagmarker = {
    saveMarker: function (idProperty) {
        var name_dialog = "dialog_saveMarker";
        var field_array = new Array();
        field_array.push({ "id": "nameSaveMarker", "type": "text", "name": "Наименование метки", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "bagmarker.addMarker('" + idProperty + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Создать метку", field_array, button_array, null);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },
    endAddMarker: function (xmldoc, args) {
        baggeneral.closeSubmenu("dialog_saveMarker");
    },
    addMarker: function (idProperty) {
        var nameSave = document.getElementById("nameSaveMarker").value;
        if (nameSave != "") {
            var formData = new FormData();
            formData.append("nameMarker", nameSave);
            formData.append("idProperty", idProperty);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/addMarker", bagmarker.endAddMarker, null);
        }
    },

    endGetMarker: function (xmldoc, args) {
        if (xmldoc) {
            var viewSaveMarker = document.getElementById("viewSaveMarker");
            viewSaveMarker.innerHTML = "";
            var d = document.createElement("div");
            d.setAttribute("class", "selectedContent");
            var span = document.createElement("p");
            span.innerText = "Нет синхронизации";
            d.appendChild(span);
            d.setAttribute("id", "0_Marker");
            d.setAttribute("onclick", "bagmarker.selectMarker(this)");
            viewSaveMarker.appendChild(d);
            var thisMarker = "0";
            var root_node = xmldoc.querySelectorAll("marker");
            if (root_node.length > 0) {
                for (var i = 0; i < root_node.length; i++) {
                    d = document.createElement("div");
                    d.setAttribute("class", "selectedContent");
                    span = document.createElement("p");
                    span.innerText = root_node[i].querySelectorAll("nameMarker")[0].childNodes[0].nodeValue;
                    thisMarker = root_node[i].querySelectorAll("thisMarker")[0].childNodes[0].nodeValue;
                    d.appendChild(span);
                    d.setAttribute("id", root_node[i].querySelectorAll("idMarker")[0].childNodes[0].nodeValue + "_Marker");                    
                    d.setAttribute("onclick", "bagmarker.selectMarker(this)");
                    viewSaveMarker.appendChild(d);
                }                
            }
            if (document.getElementById(thisMarker + "_Marker"))
                bagmarker.selectMarker(document.getElementById(thisMarker + "_Marker"));
            baggeneral.centerDiv("dialog_getSaveMarker");
        }
    },
    getMarker: function (idProperty) {
        var name_dialog = "dialog_getSaveMarker";
        var inner_html = "<div id='viewSaveMarker'></div><input id='selectMarker' type='hidden' value=''/>";

        var button_array = new Array();
        button_array.push({ "name": "Применить", "func": "bagmarker.appyMarker('" + idProperty + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Выбор метки для синхронизации", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");
        baggeneral.centerDiv(name_dialog);

        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idProperty", idProperty);
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/getMarker", bagmarker.endGetMarker, idProperty);
        
    },
    selectMarker: function (div) {
        document.getElementById("selectMarker").value = div.id.split('_')[0];
        baggeneral.selectedActivDiv(div);
    },
    endAppyMarker: function (xmldoc, args) {
        location.reload();
    },
    appyMarker: function (idProperty) {
        var idMarker = document.getElementById("selectMarker");
        if (idMarker.value != "") {
            baggeneral.viewLoadingDiv();
            var formData = new FormData();
            formData.append("idMarker", idMarker.value);
            formData.append("idProperty", idProperty);
            bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/appyMarker", bagmarker.endAppyMarker, idProperty);
        }
        else
            baggeneral.viewMessage("dialog_messageappymarker", "Выберите настройку для применения к объекту.");
    },
};