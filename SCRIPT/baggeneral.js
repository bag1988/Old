var baggeneral = {
    loadAdminPanel: function () {        
        if (document.getElementById("admin_panel")) {
            var d = document.getElementById("admin_panel");
            document.body.setAttribute("style", "margin-top:" + d.offsetHeight + "px;");
        }
    },

    getMaxPageHeight: function () {
        return Math.max(document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0, document.documentElement.clientHeight || 0, document.body.clientHeight || 0, (document.parentWindow || document.defaultView).innerHeight || 0);
    },

    hiddenLoading: function () {        
        baggeneral.closeSubmenu("dialog_viewloading");
    },

    centerDiv: function (obj) {
        var d = document.getElementById(obj);
        d.style.display = "block";
        var div_height = d.offsetHeight;
        var div_width = d.offsetWidth;
        var scroll = baggeneral.getPageScroll();
        var set_top = (document.documentElement.clientHeight / 2 - div_height / 2 + scroll);
        var set_left = (document.documentElement.clientWidth - div_width) / 2;
        if (set_top < scroll)
            set_top = scroll;
        if (set_left < 0)
            set_left = 0;
        d.style.top = set_top + "px";
        d.style.left = set_left + "px";

        var view_submenuFon = d.querySelector(".view_submenuFon");
        if (view_submenuFon.offsetHeight)
            if (view_submenuFon.offsetHeight > 450)
                d.style.width = d.offsetWidth + 18 + "px";
    },

    createSubmenu: function (name_dialog, name_submenu, field_array, button_array, inner_html) {
        if (!document.getElementById(name_dialog)) {
            var parentMenu = document.createElement("div");
            parentMenu.setAttribute("onmousedown", "baggeneral.setMaxZindex(this);");
            parentMenu.setAttribute("id", name_dialog);

            var closeLink = document.createElement("b");
            closeLink.innerText = "X";
            closeLink.setAttribute("onclick", "baggeneral.closeSubmenu('" + name_dialog + "');");
            closeLink.setAttribute("class", "view_submenuClose");
            parentMenu.appendChild(closeLink);

            var h = document.createElement("h2");
            h.innerText = name_submenu;
            h.setAttribute("onmousedown", "baggeneral.movingSubmenu()");
            parentMenu.appendChild(h);

            var submenu = document.createElement("div");
            submenu.setAttribute("class", "view_submenuFon");
            if (inner_html) {                
                var div_message = document.createElement("div");
                div_message.setAttribute("class", "view_submenu_div");
                div_message.innerHTML = inner_html;
                submenu.appendChild(div_message);
            }
            else {
                submenu.innerHTML = bagfield.createField(field_array, "view_submenu_div").innerHTML;                
            }
            parentMenu.appendChild(submenu);
            if (button_array) {
                parentMenu.appendChild(bagfield.createButtonArray(button_array, "view_submenu_button"));
            }
            document.body.appendChild(parentMenu);            
            baggeneral.setMaxZindex(document.getElementById(name_dialog));            
            return parentMenu;
        }
        else {
            baggeneral.setMaxZindex(document.getElementById(name_dialog));
            return document.getElementById(name_dialog);
        }

    },

    closeSubmenu: function (id_submenu) {
        if (document.getElementById(id_submenu)) {
            var submenu = document.getElementById(id_submenu);
            var parent_submenu = submenu.parentNode;
            parent_submenu.removeChild(submenu);
        }
    },

    movingSubmenu: function (event) {
        event = baggeneral.fixEvent(event);
        var this_el = event.target || event.srcElement;

        if (!this_el) return;
        if (event.which != 1) return;
        if (!/dialog_\w+/.test(this_el.parentNode.id)) return;

        var parent_div = this_el.parentNode;
        baggeneral.setMaxZindex(parent_div);
        var mouseOffset = getMouseOffset(parent_div, event.pageX, event.pageY);

        function mouseMove(e) {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else {
                document.selection.empty();
            }
            e = baggeneral.fixEvent(e);
                        
            if (mouseOffset) {
                if (Math.abs(event.x - e.pageX) < 20 && Math.abs(event.y - e.pageY) < 20) {
                    return false;
                }

                var new_y = e.pageY - mouseOffset.y, new_x = e.pageX - mouseOffset.x;
                if (document.body.style.marginTop != "") {
                    new_y = new_y - parseInt(document.body.style.marginTop);
                }
                parent_div.style.top = new_y + 'px';
                parent_div.style.left = new_x + 'px';
            }

            return false;
        }

        function mouseUp() {
            this_el = null;
            mouseOffset = null;
            parent_div = null;
            document.onmousemove = document.onmouseup = null;
        }

        function getMouseOffset(target, x, y) {
            var docPos = baggeneral.getOffset(target)
            return { x: x - docPos.left, y: y - docPos.top };
        }

        document.onmousemove = mouseMove;
        document.onmouseup = mouseUp;

        return false;
    },

    setMaxZindex: function (obj) {
        var document_div = document.querySelectorAll("div");
        if (document_div) {
            for (var i = 0; i < document_div.length; i++) {
                if (document_div[i] != obj) {
                    if (document_div[i].style.zIndex == 51) {
                        document_div[i].style.zIndex = 50;
                    }
                }
            }
        }
        obj.style.zIndex = 51;
    },

    getPageScroll: function () {
        var PageScroll = (window.pageXOffset != undefined) ?
        window.pageYOffset : function () {
            var html = document.documentElement;
            var body = document.body;
            var top = html.scrollTop || body && body.scrollTop || 0;
            top -= html.clientTop;
            return top;
        };
        return PageScroll;
    },

    openDialogSelectImage: function (set_obj) {
        var name_dialog = "dialog_selectimage";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div id='view_img_user' class='view_dialog_img'></div>";

        var button_array = new Array();
        button_array.push({ "name": "Загрузить изображение", "func": "baggeneral.openDialogNewUserImg();" });
        button_array.push({ "name": "Обновить", "func": "baggeneral.openDialogSelectImage('" + set_obj + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Выбор изображения", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block; max-width: 80%;");        
        baggeneral.viewLoadingDiv();
        var formData = new FormData();
        formData.append("idPage", "0");
        bagrequest.sendRequest(formData, "POST", "/xml/general.asmx/getImagesUser", bagrequest.endSelectImgUser, set_obj);

        baggeneral.centerDiv(name_dialog);
    },

    openDialogNewUserImg: function () {
        var name_dialog = "dialog_newuserfile";
        var inner_html = "<div class='newuserfile' id='view_new_user_file'></div><input onchange='bagrequest.saveImg();' id='add_user_file' multiple='multiple' type='file' />";

        var button_array = new Array();
        button_array.push({ "name": "Очистить", "func": "baggeneral.closeSubmenu('" + name_dialog + "'); baggeneral.openDialogNewUserImg();" });
        button_array.push({ "name": "Добавить", "func": "bagrequest.saveNewUserFile();" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Загрузка файлов", null, button_array, inner_html);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);
    },

    dialogGetColor: function (namefunc) {        
        var name_dialog = "dialog_selectcolor";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div class='picker' id='primary_block'><div id='line'><div id='arrows'><div class='left_arrow'></div><div class='right_arrow'></div></div></div><div id='block_picker'><img src='/images/bgGradient.png' class='bk_img'><div class='circle' id='circle'></div></div><div id='out_color' class='out_color'></div></div>";

        var button_array = new Array();
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Выбор цвета", null, button_array, inner_html);
        var h = document.createElement("input");
        h.setAttribute("type", "hidden");
        h.setAttribute("id", "nextNamefunc");
        h.value = namefunc;
        submenu.appendChild(h);
        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        picker.init();
        baggeneral.centerDiv(name_dialog);        
    },

    dialogCssEditor: function (idProperty) {
        var name_dialog = "dialog_csseditor";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = baggeteditor.geteditorcss().innerHTML;
        var button_array = new Array();
        button_array.push({ "name": "Код CSS", "func": "baggeteditor.dialogViewCssCode('false');" });
        button_array.push({ "name": "Сохранить", "func": "bagrequest.saveStyle(); baggeneral.closeSubmenu('" + name_dialog + "');" });
        button_array.push({ "name": "Отмена", "func": "bagcsseditor.closeCssEditor(); baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Редактор CSS", null, button_array, inner_html);
        
        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block; width:1000px; ");
        baggeneral.centerDiv(name_dialog);
        bagrequest.objUpdate = idProperty;
        bagrequest.getStyle(idProperty);

        var navDiv = document.createElement("div");
        navDiv.setAttribute("id", "navSelectElement");
        navDiv.setAttribute("style", "margin-top: 10px; white-space:pre-wrap; color:#FF3300;");
        navDiv.innerHTML = "<b>Редактируемый элемент: </b>не выбран!!!";
        var butDiv = submenu.querySelector(".view_submenu_div");
        butDiv.appendChild(navDiv);
    },

    dialogCssEditorFast: function (idProperty) {
        var name_dialog = "dialog_csseditorfast";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var div = baggeteditor.geteditorcss();
        var removeDiv = div.querySelector(".view_visual_module");
        div.removeChild(removeDiv);             
        var inner_html = div.innerHTML;
        
        var button_array = new Array();
        button_array.push({ "name": "Код CSS", "func": "baggeteditor.dialogViewCssCode('false');" });
        button_array.push({ "name": "Сохранить", "func": "bagrequest.saveStyle(); baggeneral.closeSubmenu('" + name_dialog + "');" });
        button_array.push({ "name": "Отмена", "func": "bagcsseditor.closeCssEditor(); baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Оформление блока", null, button_array, inner_html);        
        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block;");        
        baggeneral.centerDiv(name_dialog);
        bagrequest.objUpdate = idProperty;
        bagcsseditor.fastEditor = "true";        
        var container = document.getElementById(idProperty + "_container");
        bagcsseditor.activElement = container;
        bagrequest.getStyle(idProperty); 
    },

    setColor: function (color) {
        var nextfunc = document.getElementById("nextNamefunc").value;        
        var out_color = document.getElementById("out_color");
        out_color.style.backgroundColor = color;
        if (document.getElementById(nextfunc)) {
            var parent_color = document.getElementById(nextfunc);
            parent_color.value = color;
            parent_color.onclick = bagcsseditor.insertCssCode;
            parent_color.click();
        }
        else
            bageditor.setColor(color);

    },

    getFontName: function () {
        var fontName = new Array();
        fontName.push({ "name": "Arial, Helvetica, sans-serif" });
        fontName.push({ "name": "Arial Black, Gadget, sans-serif" });
        fontName.push({ "name": "Comic Sans MS, cursive" });
        fontName.push({ "name": "Courier New, Courier, monospace" });
        fontName.push({ "name": "Georgia, serif" });
        fontName.push({ "name": "Impact, Charcoal, sans-serif" });
        fontName.push({ "name": "Lucida Console, Monaco, monospace" });
        fontName.push({ "name": "Lucida Sans Unicode, Lucida Grande, sans-serif" });
        fontName.push({ "name": "Palatino Linotype, Book Antiqua, Palatino, serif" });
        fontName.push({ "name": "Tahoma, Geneva, sans-serif" });
        fontName.push({ "name": "Times New Roman, Times, serif" });
        fontName.push({ "name": "Trebuchet MS, Helvetica, sans-serif" });
        fontName.push({ "name": "Verdana, Geneva, sans-serif" });
        fontName.push({ "name": "Symbol, Symbol (Symbol, Symbol)" });
        fontName.push({ "name": "Webdings, Webdings (Webdings, Webdings)" });
        fontName.push({ "name": "Wingdings, Zapf Dingbats (Wingdings, Zapf Dingbats)" });
        fontName.push({ "name": "MS Sans Serif, Geneva, sans-serif" });
        fontName.push({ "name": "MS Serif, New York, serif" });
        return fontName;
    },

    saveProperty: function (id_property) {
        var name_dialog = "dialog_saveProperty";
        var field_array = new Array();
        field_array.push({ "id": "nameSaveProperty", "type": "text", "name": "Имя настройки", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Сохранить", "func": "bagrequest.saveProperty('" + id_property + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Сохранить настройки", field_array, button_array, null);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        baggeneral.centerDiv(name_dialog);

    },

    selectedActivDiv: function (selectDiv) {
        var viewExten = selectDiv.parentNode;
        var view_exten = viewExten.querySelectorAll("div");
        for (var i = 0; i < view_exten.length; i++) {
            view_exten[i].removeAttribute("style");
        }        
        selectDiv.setAttribute("style", "color:#FF3300;");
    },

    viewMessage: function (namedialog, messegText) {
        if (document.getElementById(namedialog))
            baggeneral.closeSubmenu(namedialog);
        var name_dialog = namedialog;
        var inner_html = messegText;        
        var button_array = new Array();
        button_array.push({ "name": "Закрыть", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "Сообщение", null, button_array, inner_html);
        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block; max-width: 400px;");
        baggeneral.centerDiv(name_dialog);
    },
        
    viewLoadingDiv: function () {
        var name_dialog = "dialog_viewloading";
        if (document.getElementById(name_dialog))
            baggeneral.closeSubmenu(name_dialog);
        var inner_html = "<div style='text-align:center;'><img alt='Загрузка...' src='/images/load.gif'/></.div>";
        var button_array = new Array();
        var submenu = baggeneral.createSubmenu(name_dialog, "", null, null, inner_html);
        submenu.setAttribute("class", "view_submenu");
        submenu.setAttribute("style", "display:block; width: 200px;");
        baggeneral.centerDiv(name_dialog);
    },

    fixEvent: function (e) {
        // получить объект событие для IE
        e = e || window.event

        // добавить pageX/pageY для IE
        if (e.pageX == null && e.clientX != null) {
            var html = document.documentElement
            var body = document.body
            e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
            e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
        }

        // добавить which для IE
        if (!e.which && e.button) {
            e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0))
        }

        return e
    },

    getOffset: function (elem) {
        if (elem.getBoundingClientRect) {
            return baggeneral.getOffsetRect(elem)
        } else {
            return baggeneral.getOffsetSum(elem)
        }
    },

    getOffsetRect: function (elem) {
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;

        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    },

    getOffsetSum: function (elem) {
        var top = 0, left = 0
        while (elem) {
            top = top + parseInt(elem.offsetTop)
            left = left + parseInt(elem.offsetLeft)
            elem = elem.offsetParent
        }

        return { top: top, left: left }
    },

    getNullValue: function (oldValue) {
        if (!oldValue[0])
            return "";
        else
            if (!oldValue[0].childNodes[0])
                return "";
            else
                if (oldValue[0].childNodes[0].nodeValue.replace(/\s+/g, '')=="")
                    return "";
                else
                    return oldValue[0].childNodes[0].nodeValue;
        return "";
    },

    getPageId:function()
    {
        var f = document.querySelectorAll("form");
        var b = null;
        for (var i = 0; i < f.length; i++) {
            if (f[i].id && /form_\d+/i.test(f[i].id)) {
                b = i;
                break;
            }
        }
        if (/form_\d+/i.test(f[b].id)) {
            return f[b].id.match(/\d+/)[0];
        }
        return null;
    },

    viewBigImg: function (obj) {

        if (!document.getElementById("viewBigImg")) {
            var container = obj.parentNode;
            while (!/^\d+\_container$/.test(container.id)) {
                container = container.parentNode;
            }
            if (/^\d+\_container$/.test(container.id)) {

                var urlBig = obj.getAttribute("src").replace(/(s)(\d+)(?=.)/, "$2");
                baggeneral.urlBigImg = new Image();
                baggeneral.urlBigImg.src = urlBig;
                setTimeout('baggeneral.loadImg()', 5);

                baggeneral.arraybigimg = container.querySelectorAll("img");

                var parentDiv = document.createElement("div");
                var div = document.createElement("div");
                parentDiv.setAttribute("id", "viewBigImg");
                div.setAttribute("id", "viewBigImgDiv");
                parentDiv.setAttribute("style", "height:" + baggeneral.getMaxPageHeight() + "px;");
                parentDiv.setAttribute("onclick", "baggeneral.closeSubmenu('viewBigImg'); baggeneral.closeSubmenu('viewBigImgDiv');");

                div.setAttribute("onclick", "baggeneral.nextImg();");

                document.body.appendChild(parentDiv);
                var img = document.createElement("img");
                img.setAttribute("src", "/images/load.gif");
                img.setAttribute("id", "thisBigImg");
                div.appendChild(img);
                document.body.appendChild(div);

                baggeneral.centerDiv("viewBigImgDiv");
            }

        }
    },
    
    urlBigImg: null,

    arraybigimg: new Array(),

    nextImg: function () {
        var img = document.getElementById("thisBigImg");
        var maxI = baggeneral.arraybigimg.length;
        var i = 0;
        for (i; i < maxI; i++) {
            if (baggeneral.arraybigimg[i].src.replace(/(s)(\d+)(?=.)/, "$2") == img.src)
                break;
        }
        baggeneral.urlBigImg = new Image();        

        if(i+1<maxI)
            baggeneral.urlBigImg.src = baggeneral.arraybigimg[i + 1].src.replace(/(s)(\d+)(?=.)/, "$2");
        else
            baggeneral.urlBigImg.src = baggeneral.arraybigimg[0].src.replace(/(s)(\d+)(?=.)/, "$2");
        img.setAttribute("src", "/images/load.gif");
        baggeneral.centerDiv("viewBigImgDiv");
        setTimeout('baggeneral.loadImg()', 5);
    },

    loadImg: function () {        
        if (baggeneral.urlBigImg.complete || baggeneral.urlBigImg.readyState === 4) {
            var img = document.getElementById("thisBigImg");
            img.src = baggeneral.urlBigImg.src;
            baggeneral.centerDiv("viewBigImgDiv");
        }
        else
            setTimeout('baggeneral.loadImg()', 5);
    },
    
    stringNameFun: function (uhandler, context) {
        var args = [].slice.call(arguments).splice(2);
        var namespaces = uhandler.split(".");
        var func = namespaces.pop();
        var context;
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func].apply(context, args);
    },
};