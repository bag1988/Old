var bagcsseditor = {
    activElement: null, //выбранный элемент
    indexElement: null, //индекс вложенности элемента относительно родителя
    parentLevel: null, //максимальный индекс родителя относительно активного элемента
    chainElements: null,//цепочка тэгов элементов
    fastEditor: null,//для бастрого редактирования
    className: null,//имя класса элемента
    oldStyle: null, //загружаемый класс

    updateCss: function (id_css) {
        var i, x, b = false;
        x = document.querySelectorAll('link');
        var rs = new RegExp(bagcsseditor.className + ".css");
        for (i = 0; i < x.length; i++) {
            if (rs.test(x[i].href)) {
                var r = new RegExp("(" + bagcsseditor.className + ".css)(\\?*\\S*)");
                x[i].href = x[i].href.replace(r, "$1?v=" + new Date().getTime());
                b = true;
                break;
            }
        }
        if (!b) {
            var link = document.createElement("link");
            link.setAttribute("href", "App_Themes/theme1/user_theme/" + bagcsseditor.className + ".css?v=" + new Date().getTime());
            link.setAttribute("type", "text/css");
            link.setAttribute("rel", "stylesheet");
            document.querySelector('HEAD').appendChild(link);
            document.getElementById(id_css + "_container").className = bagcsseditor.className;
        }
        bagrequest.objUpdate = null;
        bagcsseditor.setStyleTeg("");
        bagcsseditor.className = null;
    },

    insertIframe: function (idProperty) {
        if (document.getElementById("view_visual_module")) {            
            var view_visual_module = document.getElementById("view_visual_module");
            view_visual_module.innerHTML = "";
            bagcsseditor.activElement = null;
            var iframe = document.createElement("iframe");
            iframe.setAttribute("id", "editor_css_frame");
            iframe.setAttribute("name", "editor_css_frame");
            iframe.setAttribute("onload", "bagcsseditor.replaceElement('" + idProperty + "');");
            iframe.setAttribute("src", "about:blank");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("style", "display: block; width: 650px; height: 400px; background-color:#fff;");
            view_visual_module.appendChild(iframe);
            bagcsseditor.chainElements = null;
        }
        else {
            bagcsseditor.setStyleTeg(bagcsseditor.oldStyle);
            var container = document.getElementById(idProperty + "_container");
            bagcsseditor.chainElements = bagcsseditor.className;
            container.setAttribute("class", bagcsseditor.className);
            var i, x;
            x = document.querySelector('HEAD').querySelectorAll('link');
            var rs = new RegExp(bagcsseditor.className + ".css");
            for (i = 0; i < x.length; i++) {
                if (rs.test(x[i].href)) {
                    document.querySelector('HEAD').removeChild(x[i]);
                    break;
                }
            }
        }
        //устанавливаем события на элементы
        var css_visual_property = document.getElementById("editor_css_value");
        for (var i in css_visual_property.querySelectorAll("SELECT")) {
            css_visual_property.querySelectorAll("SELECT")[i].onchange = bagcsseditor.insertCssCode;
        }
        for (var i in css_visual_property.querySelectorAll("INPUT")) {
            css_visual_property.querySelectorAll("INPUT")[i].onkeyup = bagcsseditor.insertCssCode;
        }
        //конец
    },
    //отображаем элемент для редактирования
    replaceElement: function (id_element) {
        bagcsseditor.setStyleTeg(bagcsseditor.oldStyle);
        var f = bagcsseditor.getIframeDocument();
        var form = document.createElement("form");
        form.setAttribute("id", "edit_form");
        var old_container = document.getElementById(id_element + "_container");
        var new_container = document.createElement("div");
        new_container.innerHTML = old_container.innerHTML;
        new_container.innerHTML = new_container.innerHTML.replace(/submit/ig, "button");
        new_container.innerHTML = new_container.innerHTML.replace(/onclick|href|for/ig, "frozen");
        new_container.setAttribute("class", bagcsseditor.className);
        new_container.setAttribute("id", id_element + "_container");
        var arrayDl = new_container.querySelectorAll(".edit_module");        
        if (arrayDl.length > 0) {
            for (var i = 0; i < arrayDl.length; i++) {
                arrayDl[i].parentNode.removeChild(arrayDl[i]);                
            }
        }
        
        form.appendChild(new_container);
        f.body.appendChild(form);

        var link = document.createElement("link");
        link.setAttribute("href", "/App_Themes/theme1/BAGTheme/editor.css");
        link.setAttribute("type", "text/css");
        link.setAttribute("rel", "stylesheet");
        f.querySelector('HEAD').appendChild(link);

        var arrayDiv = f.querySelectorAll("div[id$=container]");        
        for (var i = 0; i < arrayDiv.length; i++) {
            if (arrayDiv[i].className) {
                link = document.createElement("link");
                link.setAttribute("href", "/App_Themes/theme1/user_theme/" + arrayDiv[i].className + ".css");
                link.setAttribute("type", "text/css");
                link.setAttribute("rel", "stylesheet");
                f.querySelector('HEAD').appendChild(link);
            }
        }

        f.body.onclick = bagcsseditor.setActivElement;
        f.body.onmousemove = bagcsseditor.mouseMoveElement;
        f.body.onmouseout = bagcsseditor.mouseOutElement;        
    },
    //выбор элемента и задание фона
    setActivElement: function (event) {
        event = event || window.event;
        var t = event.target || event.srcElement;
        if (t.tagName != "FORM") {
            var index_element;
            //получаем индекс выбранного элемента
            for (var i in t.parentNode.childNodes) {
                if (t == t.parentNode.childNodes[i]) {
                    index_element = i; break;
                }
            }
            //если текущий элемент не равен активному, обнуляем переменные
            var lasttag = bagcsseditor.activElement ? bagcsseditor.activElement.tagName : "null";
            if (index_element != bagcsseditor.indexElement || t.tagName != lasttag) {
                bagcsseditor.parentLevel = -1;
                bagcsseditor.indexElement = index_element;
                bagcsseditor.activElement = t;
            }
            var f = bagcsseditor.getIframeDocument();
            var form = f.getElementById("edit_form");
            bagcsseditor.removeSelectElement(form);
            bagcsseditor.parsingCssCode();
        }
    },
    //выбор всех элементов с заданным тегом относительно вложенности по переменной bagcsseditor.parentLevel
    allTagName: function () {
        if (bagcsseditor.parentLevel < 0) {
            if (bagcsseditor.activElement.className && bagcsseditor.activElement.tagName != "FORM")
                bagcsseditor.activElement.className = bagcsseditor.activElement.className.replace("select_element_css", "") + " select_element_css";
            else
                bagcsseditor.activElement.className = "select_element_css";
            bagcsseditor.parentLevel = bagcsseditor.parentLevel + 1;
        }
        else {
            if (bagcsseditor.activElement.parentNode.tagName != "FORM") {
                var parent_obj = bagcsseditor.activElement.parentNode;
                var count_while = 0;
                //получаем родителя выбранного элемента относительно вложенности по переменной bagcsseditor.parentLevel
                while (count_while < bagcsseditor.parentLevel && parent_obj.parentNode.tagName != "FORM") {
                    parent_obj = parent_obj.parentNode;
                    count_while = count_while + 1;
                }
                var childarray = parent_obj.querySelectorAll(bagcsseditor.activElement.tagName);
                for (var i in childarray) {
                    if (childarray[i].className)
                        childarray[i].className = childarray[i].className.replace("select_element_css", "") + " select_element_css";
                    else
                        childarray[i].className = "select_element_css";
                }
                if (parent_obj.parentNode.tagName != "FORM")
                    bagcsseditor.parentLevel = bagcsseditor.parentLevel + 1;
                else
                    bagcsseditor.parentLevel = -1;
            }
            else
                bagcsseditor.parentLevel = -1;
        }
    },
    //получение цепочки родителей элемента
    getParentElement: function (obj) {
        var str = "";
        var array_tagname_element = new Array();

        //получаем цепочку родителей и их индексы
        if (obj.parentNode.tagName != "FORM") {
            var parent_obj = obj.parentNode;
            while (parent_obj.tagName != "FORM") {
                //получаем индексы родителей
                var parentarray = parent_obj.parentNode.querySelectorAll(parent_obj.tagName);
                for (var i = 0; i < parentarray.length; i++) {
                    if (parent_obj.parentNode.tagName == "FORM") {
                        str = bagcsseditor.className;
                    }
                    if (parentarray[i] == parent_obj) {
                        array_tagname_element.push(parent_obj.tagName + ":nth-of-type(" + (i + 1) + ")");
                        parent_obj = parent_obj.parentNode;
                        break;
                    }
                }
            }

            var child_index = bagcsseditor.activElement.tagName;
            var chain_parent = bagcsseditor.parentLevel;
            if (bagcsseditor.parentLevel < 0) {
                chain_parent = 0;
                var element_array = bagcsseditor.activElement.parentNode.querySelectorAll(bagcsseditor.activElement.tagName);
                for (var i = 0; i < element_array.length; i++) {
                    if (element_array[i] == bagcsseditor.activElement) {
                        child_index = bagcsseditor.activElement.tagName + ":nth-of-type(" + (i + 1) + ")"; break;
                    }
                }
            }

            for (var i = array_tagname_element.length - 2; i >= chain_parent; i--) {
                str = str + " " + array_tagname_element[i];
            }
            str = str + " " + child_index;
            
            return str;
        }
        else
            return bagcsseditor.className;
    },
    
    parsingCssCode: function () {
        //устанавливаем нулевые значения в визуальном редакторе
        var css_visual_property = document.getElementById("editor_css_value");
        for (var i in css_visual_property.querySelectorAll("SELECT")) {
            css_visual_property.querySelectorAll("SELECT")[i].selectedIndex = 0;
        }
        for (var i in css_visual_property.querySelectorAll("INPUT")) {
            css_visual_property.querySelectorAll("INPUT")[i].value = "";
        }
        //конец

        if (bagcsseditor.activElement) {
            var text = bagcsseditor.getStyleTeg();//получаем значение стиля
            if (!bagcsseditor.fastEditor) {
                bagcsseditor.chainElements = bagcsseditor.getParentElement(bagcsseditor.activElement);
                bagcsseditor.allTagName();
            }
            if (document.getElementById("navSelectElement"))
                document.getElementById("navSelectElement").innerHTML = "<b>Редактируемый элемент: </b>" + bagcsseditor.chainElements;
            
            var new_value;            
            text = text.replace(/(\s*\.\s*.*\s*\{\s*\})/ig, "");//удаляем пустые классы    
            var reg_select_element_css = bagcsseditor.chainElements.replace(/(?:\()([^\(\)]+)(?:\))/g, "\\($1\\)");
            if (text.search(new RegExp(reg_select_element_css + "\\s*\\{", "ig")) < 0) {
                bagcsseditor.setStyleTeg(text + "\n." + bagcsseditor.chainElements + "{}");
            }
            else {
                bagcsseditor.setStyleTeg(text);
                var re = reg_select_element_css + "\\s*\\{[^\\{\\}]*\\}";
                var findstr = text.match(new RegExp(re, "ig"));
                var css_property = findstr[0].match(/([^\{\}\s\:\;]+\s*\:[^\{\}\;\:]+)(?=\;)/ig);//получаем свойства css
                var id_property;
                var value_property;
                if (css_property) {
                    for (var i = 0; i < css_property.length; i++) {
                        if (document.getElementById(css_property[i].split(':')[0].replace(/-/g, '_'))) {

                            id_property = document.getElementById(css_property[i].split(':')[0].replace(/-/g, '_'));
                            value_property = css_property[i].split(':')[1].replace(' ', '');
                            if (/select/i.test(id_property.tagName)) {
                                id_property.value = value_property;
                            }
                            if (/input/i.test(id_property.tagName)) {
                                var m = baggeteditor.metric;
                                var numValue = "";
                                var metricValue = "";
                                for (var c = 0; c < m.length; c++) {
                                    var r = new RegExp(m[c] + "$");
                                    if (r.test(value_property)) {
                                        numValue = value_property.match(/\-?\+?\d+/)[0];
                                        metricValue = m[c];
                                        break;
                                    }
                                }
                                id_property.value = numValue;
                                if (document.getElementById("for_" + id_property.id))
                                    document.getElementById("for_" + id_property.id).value = metricValue;
                            }
                        }
                    }
                }
            }
        }
    },

    insertCssCode: function (event) {        
        if (bagcsseditor.chainElements) {
            event = event || window.event;
            var t = event.target || event.srcElement;
            if (t.tagName == "SELECT" || t.tagName == "INPUT") {
                var id_property = t.id.replace(/_/g, '-');
                var value_property = t.value;
                if (/for_/ig.test(t.id)) {
                    var input_value = document.getElementById(t.id.replace("for_", "")).value;
                    id_property = t.id.replace("for_", "").replace(/_/g, '-');
                    value_property = input_value == "" ? "" : input_value + value_property;
                }
                if (t.tagName == "INPUT") {
                    if (document.getElementById("for_" + t.id)) {
                        value_property = value_property == "" ? "" : value_property + document.getElementById("for_" + t.id).value;
                    }
                }
                
                var text = bagcsseditor.getStyleTeg();
                var reg_select_element_css = bagcsseditor.chainElements.replace(/(?:\()([^\(\)]+)(?:\))/g, "\\($1\\)");
                var re = reg_select_element_css + "\\s*\\{[^\\{\\}]*\\}";
                var findstr = text.match(new RegExp(re, "ig"));
                var css_property = findstr[0].match(/([^\{\}\s\:\;]+\s*\:[^\{\}\;\:]+)(?=\;)/ig);

                var new_css_property = "";
                
                for (var i in css_property) {
                    if (css_property[i].split(':')[0].replace(/ /g, '') == id_property) {
                        css_property[i] = value_property == "" ? "" : id_property + ":" + value_property;
                        new_css_property = "true";
                        break;
                    }
                }

                if (new_css_property == "true")
                    new_css_property = "";
                else
                    new_css_property = value_property == "" ? "" : id_property + ":" + value_property + ";";

                for (var i in css_property) {
                    new_css_property += css_property[i] == "" ? "" : css_property[i] + ";";
                }
                bagcsseditor.setStyleTeg(text.replace(new RegExp("(" + reg_select_element_css + "\\s*\\{)([^\\{\\}]*)", "ig"), "$1" + new_css_property));
            }
        }
    },

    //получаем содержимое style тэга
    getStyleTeg: function () {
        var f = bagcsseditor.getIframeDocument();
        var style_array = f.querySelector('HEAD').querySelectorAll("style");
        var i = 0;
        var rs = new RegExp(bagcsseditor.className);
        for (i = 0; i < style_array.length; i++) {            
            if (style_array[i].innerHTML != "" || style_array[i].innerHTML != "undefined")
                if (rs.test(style_array[i].innerHTML)) {
                    return style_array[i].innerHTML;
                }
        }
        return "";
    },
    //записываем содержимое style тэга
    setStyleTeg: function (new_style) {
        var f = bagcsseditor.getIframeDocument();        
        var find_style = false;
        var style_array = f.querySelector('HEAD').querySelectorAll("style");
        var rs = new RegExp(bagcsseditor.className);        
        for (var i in style_array) {
            if (style_array[i].innerHTML != ""|| style_array[i].innerHTML !="undefined") {
                if (rs.test(style_array[i].innerHTML)) {
                    style_array[i].innerHTML = new_style;
                    find_style = true;
                }
            }
        }
        //в случаи отсутствия нажных классов добавляем новый
        if (!find_style) {            
            var style = document.createElement("style");
            style.innerHTML = new_style;            
            f.querySelector('HEAD').appendChild(style);
        }
    },

    viewCode: function () {
        var text = document.getElementById("text_css_code");
        bagcsseditor.setStyleTeg(text.value);
        text.value = "";
        bagcsseditor.chainElements = "";
        var f = bagcsseditor.getIframeDocument();
        f.body.click();
        bagcsseditor.activElement = null;
        bagcsseditor.parsingCssCode();        
    },
    //выделение элемента при наведении курсора
    mouseMoveElement: function (event) {
        event = event || window.event
        // кросс-браузерно получить target
        var t = event.target || event.srcElement
        if (t.tagName != "FORM") {
            if (t.className)
                t.className = t.className.replace("fon_select_element", "") + " fon_select_element";
            else
                t.className = "fon_select_element";
        }
    },
    //снятие выделения при выходе курсора за границы элемента
    mouseOutElement: function (event) {
        event = event || window.event
        // кросс-браузерно получить target
        var t = event.target || event.srcElement
        if (t.className)
            t.className = t.className.replace("fon_select_element", "");
    },
    //снятие выделения активного элемента
    removeSelectElement: function (obj) {
        for (var i in obj.childNodes) {
            if (obj.childNodes[i].className)
                obj.childNodes[i].className = obj.childNodes[i].className.replace("select_element_css", "");
            bagcsseditor.removeSelectElement(obj.childNodes[i]);
        }
    },

    getIframeDocument: function () { 
        if (document.getElementById("editor_css_frame")) {
            if (document.getElementById("editor_css_frame").contentWindow) return document.getElementById("editor_css_frame").contentWindow.document;
            if (document.getElementById("editor_css_frame").contentDocument) return document.getElementById("editor_css_frame").contentDocument;
            return document.getElementById("editor_css_frame").document;
        }
        return document;
    },

    closeCssEditor: function () {
        bagcsseditor.updateCss(bagrequest.objUpdate);        
        bagcsseditor.indexElement = null;
        bagcsseditor.activElement = null;
        bagcsseditor.parentLevel = null;
        bagcsseditor.chainElements = null;
        bagcsseditor.fastEditor = null;
        bagcsseditor.oldStyle = null;
    }
};