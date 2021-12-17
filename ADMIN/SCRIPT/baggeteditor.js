var baggeteditor = {
    metric: ["px", "%", "pt", "in", "cm", "mm", "pc", "ex", "em"],
    geteditortext: function () {
        
        var divMenu = document.createElement("div");
        var select = document.createElement("select");
        for (var i = -1; i < 7; i++) {
            var op = document.createElement("option");
            op.value = i == -1 ? "" : i == 0 ? "&lt;p&gt;" : "&lt;h" + i + "&gt";
            op.innerText = i == -1 ? "- Стиль -" : i == 0 ? "Обычный" : "Заголовок " + i;
            select.appendChild(op);
        }

        select.setAttribute("onchange", "bageditor.formatText('formatBlock', this.value); this.value='';");
        divMenu.appendChild(select);

        select = document.createElement("select");
        for (var i = 0; i < 8; i++) {
            var op = document.createElement("option");
            op.value = i == 0 ? "" : i;
            op.innerText = i == 0 ? "- Размер -" : i;
            select.appendChild(op);
        }
        select.setAttribute("onchange", "bageditor.formatText('FontSize', this.value); this.value='';");
        divMenu.appendChild(select);

        select = document.createElement("select");
        var fontName = baggeneral.getFontName();
        for (var i = -1; i < fontName.length; i++) {
            var op = document.createElement("option");
            op.value = i == -1 ? "" : fontName[i].name;
            op.innerHTML = i == -1 ? "- Шрифт -" : fontName[i].name;
            select.appendChild(op);
        }
        select.setAttribute("onchange", "bageditor.formatText('FontName', this.value); this.value='';");
        divMenu.appendChild(select);


        var imageArray = new Array();

        imageArray.push({ "src": "/images/icons/bold.gif", "title": "Жирный", "onclick": "bageditor.formatText('Bold');" });        
        imageArray.push({ "src": "/images/icons/italic.gif", "title": "Курсив", "onclick": "bageditor.formatText('Italic');" });
        imageArray.push({ "src": "/images/icons/underline.gif", "title": "Подчеркнутый", "onclick": "bageditor.formatText('Underline');" });
        imageArray.push({ "src": "/images/icons/removeformat.gif", "title": "Удалить форматирование", "onclick": "bageditor.formatText('removeformat');" });
        imageArray.push({ "src": "/images/icons/undo.gif", "title": "Отменить", "onclick": "bageditor.formatText('Undo')" });
        imageArray.push({ "src": "/images/icons/redo.gif", "title": "Повторить", "onclick": "bageditor.formatText('Redo')" });
        imageArray.push({ "src": "/images/icons/left.gif", "title": "Выровнить по левому краю", "onclick": "bageditor.formatText('JustifyLeft')" });
        imageArray.push({ "src": "/images/icons/center.gif", "title": "Выровнить по центру", "onclick": "bageditor.formatText('JustifyCenter')" });
        imageArray.push({ "src": "/images/icons/right.gif", "title": "Выровнить по правому краю", "onclick": "bageditor.formatText('JustifyRight')" });
        imageArray.push({ "src": "/images/icons/justify.gif", "title": "Выровнить по краям", "onclick": "bageditor.formatText('JustifyFull')" });
        imageArray.push({ "src": "/images/icons/marklist.gif", "title": "Маркированный список", "onclick": "bageditor.formatText('InsertUnorderedList', '')" });
        imageArray.push({ "src": "/images/icons/numlist.gif", "title": "Маркированный список", "onclick": "bageditor.formatText('InsertOrderedList', '')" });
        imageArray.push({ "src": "/images/icons/rightlist.gif", "title": "Увеличить отступ", "onclick": "bageditor.formatText('Indent', '')" });
        imageArray.push({ "src": "/images/icons/leftlist.gif", "title": "Уменьшить отступ", "onclick": "bageditor.formatText('Outdent', '')" });
        imageArray.push({ "src": "/images/icons/link.gif", "title": "Вставить ссылку", "onclick": "bageditor.dialogAddLink()" });
        imageArray.push({ "src": "/images/icons/unlink.gif", "title": "Удалить ссылку", "onclick": "bageditor.formatText('UnLink')" });
        imageArray.push({ "src": "/images/icons/br.gif", "title": "Новая строка", "onclick": "bageditor.setHtml('<br/>')" });
        imageArray.push({ "src": "/images/icons/table.gif", "title": "Вставить таблицу", "onclick": "bageditor.dialogAddTable()" });
        imageArray.push({ "src": "/images/icons/table_insert_row.gif", "title": "Вставить строку", "onclick": "bageditor.insertRow()" });
        imageArray.push({ "src": "/images/icons/table_delete_row.gif", "title": "Удалить строку", "onclick": "bageditor.deleteRow()" });
        imageArray.push({ "src": "/images/icons/table_insert_col.gif", "title": "Вставить столбец", "onclick": "bageditor.insertCol()" });
        imageArray.push({ "src": "/images/icons/table_delete_col.gif", "title": "Удалить столбец", "onclick": "bageditor.deleteCol()" });
        imageArray.push({ "src": "/images/icons/table_span.gif", "title": "Разбить ячейку", "onclick": "bageditor.splitCell()" });
        imageArray.push({ "src": "/images/icons/table_cell.gif", "title": "Свойства ячейки", "onclick": "bageditor.dialogPropCell()" });
        imageArray.push({ "src": "/images/icons/image.gif", "title": "Вставить рисунок", "onclick": "bageditor.dialogAddImg()" });
        imageArray.push({ "src": "/images/icons/html.gif", "title": "Вставить HTML-код", "onclick": "bageditor.dialogAddHtml()" });
        imageArray.push({ "src": "/images/icons/font.gif", "title": "Цвет шрифта", "onclick": "bageditor.insertColor()" });
        imageArray.push({ "src": "/images/icons/select.gif", "title": "Выбрать цвет", "onclick": "baggeneral.dialogGetColor('bageditor.setColor')" });
        imageArray.push({ "src": "/images/icons/symbol.gif", "title": "Вставить специальный символ", "onclick": "bageditor.dialogAddSymbols()" });

        
        for (var i = 0; i < imageArray.length; i++) {
            var img = document.createElement("img");
            img.setAttribute("src", imageArray[i].src);
            img.setAttribute("title", imageArray[i].title);            
            img.setAttribute("onclick", imageArray[i].onclick);
            divMenu.appendChild(img);
        }

        var h = document.createElement("input");
        h.setAttribute("type", "hidden");
        h.setAttribute("id", "editor_fontcolor");
        h.setAttribute("value", "#000000");
        divMenu.appendChild(h);  

        return divMenu;

    },
    geteditorcss: function () {
        var cssEditor = document.createElement("div");
        var divproperty = document.createElement("div");
        divproperty.setAttribute("id", "editor_css_value");
        divproperty.setAttribute("class", "editor_css_value");
        //шрифт
        var fontName = baggeneral.getFontName();
        var strfontName = ";";
        for (var i = 0; i < fontName.length; i++) {
            strfontName += fontName[i].name + ";";
        }
        var fontSize = ";";
        for (var i = 6; i < 51; ) {
            fontSize += i + "px:" + i + ";";
            i = i + 2;
        }
        var fontWeight = ";lighter;100;200;300;400;500;600;700;800;900;bold;bolder";
        var fontStyle = ";normal:Обычное;italic:Курсив;oblique:Наклон;inherit:Значение родителя";
        var fontVariant = ";normal:Обычное;small-caps:Заглавные;inherit:Значение родителя";
        var fontTransform = ";capitalize:Первый символ заглавный;lowercase:Все строчные;uppercase:Все прописные;none:Нет;inherit:Значение родителя";
        var fontDecoration = ";blink:Мигающий текст;line-through:Перечеркнутый текст;overline:Линия над текстом;underline:Подчеркнутый текст;none:Нет;inherit:Значение родителя";

        var property = new Array();
        property.push({ "name": "Семейство шрифтов", "options": "font_family", "arrayvalue": strfontName, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Размер шрифта", "options": "font_size", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Насыщенность шрифта", "options": "font_weight", "arrayvalue": fontWeight, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Начертание шрифта", "options": "font_style", "arrayvalue": fontStyle, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Строчные буквы", "options": "font_variant", "arrayvalue": fontVariant, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Заглавные", "options": "text_transform", "arrayvalue": fontTransform, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Цвет текста", "options": "color", "arrayvalue": "", "boolmetric": false, "buttonfunc": "baggeneral.dialogGetColor('color')" });
        property.push({ "name": "Оформление текста", "options": "text_decoration", "arrayvalue": fontDecoration, "boolmetric": false, "buttonfunc": null });
       
                
        var p = document.createElement("p");
        p.innerText = "Шрифт";
        p.setAttribute("onclick", "baggeteditor.viewProperty('fontProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("fontProperty", property));

        //Блок
        var verticalAlign = ";baseline:По базовой линии родителя;bottom:По нижней части;middle:По базовой линии;sub:Элемент изображается как подстрочный;super:Элемент изображается как надстрочный;text-bottom:По нижнему краю текущей строки;text-top:По самому высокому текстовому элементу;top:По верхней части";
        var textAlign = ";center:По центру;justify:По ширине;left:По левому краю;right:По правому краю";
        var whiteSpace = ";normal:Автоматически;nowrap:Пробелы не учитываются, текст не переносится;pre:Пробелы учитываются, текст не переносится;pre-line:Пробелы не учитываются, текст переносится;pre-wrap:Пробелы учитываются, текст переносится;inherit:Значение родителя";
        property = new Array();
        property.push({ "name": "Mежстрочный интервал", "options": "line_height", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Выравнивание по вертикали", "options": "vertical_align", "arrayvalue": verticalAlign, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Выравнивание по горизонтали", "options": "text_align", "arrayvalue": textAlign, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Отступ первой строки", "options": "text_indent", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Пробелы между словами", "options": "white_space", "arrayvalue": whiteSpace, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Интервал между словами", "options": "word_spacing", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Интервал между символами", "options": "letter_spacing", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
       
        p = document.createElement("p");
        p.innerText = "Блок";
        p.setAttribute("onclick", "baggeteditor.viewProperty('blockProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("blockProperty", property));

        //Фон
        var backRepeat = ";no-repeat:Без повторений;repeat:По горизонтали и вертикали;repeat-x:Только по горизонтали;repeat-y:Только по вертикали;inherit:Значение родителя";
        var backAttach = ";fixed:Фоновое изображение неподвижное;scroll:Фон прокручивается;inherit:Значение родителя";
        var xPosition = ";left:Левый угол;center:По центру;right:Правый угол";
        var yPosition = ";top:Верхний угол;center:По центру;bottom:Нижний угол";
        property = new Array();
        property.push({ "name": "Цвет фона", "options": "background_color", "arrayvalue": "", "boolmetric": false, "buttonfunc": "baggeneral.dialogGetColor('background_color')" });
        property.push({ "name": "Фоновое изображение", "options": "background_image", "arrayvalue": "", "boolmetric": false, "buttonfunc": "baggeneral.openDialogSelectImage('background_image')" });
        property.push({ "name": "Повторение фонового изображения", "options": "background_repeat", "arrayvalue": backRepeat, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Прокрутка фонового изображения", "options": "background_attachment", "arrayvalue": backAttach, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "(x) Начальное положение фона", "options": "background_position_x", "arrayvalue": xPosition, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "(y) Начальное положение фона", "options": "background_position_y", "arrayvalue": yPosition, "boolmetric": false, "buttonfunc": null });
       

        p = document.createElement("p");
        p.innerText = "Фон";
        p.setAttribute("onclick", "baggeteditor.viewProperty('fonProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("fonProperty", property));

        //Границы
        var styleBorder = ";none:Линия не отображается;dotted:Линия состоящая из набора точек;dashed:Пунктирная линия;solid:Сплошная линия;double:Двойная линия;groove:Создает эффект вдавленной линии;ridge:Создает эффект рельефной линии;inset:Псевдотрехмерная линия (вниз);outset:Псевдотрехмерная линия(вверх);inherit:Значение родителя";
        var countBorder = new Array();
        countBorder.push({ "name": "Верхняя", "value": "top" });
        countBorder.push({ "name": "Нижняя", "value": "bottom" });
        countBorder.push({ "name": "Левая", "value": "left" });
        countBorder.push({ "name": "Правая", "value": "right" });

        for (var i = 0; i < countBorder.length; i++) {
            property = new Array();
            property.push({ "name": "Стиль границы", "options": "border_" + countBorder[i].value + "_style", "arrayvalue": styleBorder, "boolmetric": false, "buttonfunc": null });
            property.push({ "name": "Толщина линии", "options": "border_" + countBorder[i].value + "_width", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
            property.push({ "name": "Цвет линии", "options": "border_" + countBorder[i].value + "_color", "arrayvalue": "", "boolmetric": false, "buttonfunc": "baggeneral.dialogGetColor('border_" + countBorder[i].value + "_color')" });

            p = document.createElement("p");
            p.innerText = countBorder[i].name+" граница";
            p.setAttribute("onclick", "baggeteditor.viewProperty('" + countBorder[i].value + "Border')");
            divproperty.appendChild(p);
            divproperty.appendChild(baggeteditor.createProperty(countBorder[i].value + "Border", property));
        }

        //padding
        var countpadding = new Array();
        countpadding.push({ "name": "Верхнее", "value": "top" });
        countpadding.push({ "name": "Нижнее", "value": "bottom" });
        countpadding.push({ "name": "Левое", "value": "left" });
        countpadding.push({ "name": "Правое", "value": "right" });
        property = new Array();
        for (var i = 0; i < countpadding.length; i++) {            
            property.push({ "name": countpadding[i].name + " значение", "options": "padding_" + countpadding[i].value, "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        }

        p = document.createElement("p");
        p.innerText = "Внутренние поля";
        p.setAttribute("onclick", "baggeteditor.viewProperty('paddingProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("paddingProperty", property));

        //margin
        var countmargin = new Array();
        countmargin.push({ "name": "Верхнее", "value": "top" });
        countmargin.push({ "name": "Нижнее", "value": "bottom" });
        countmargin.push({ "name": "Левое", "value": "left" });
        countmargin.push({ "name": "Правое", "value": "right" });
        property = new Array();
        for (var i = 0; i < countpadding.length; i++) {
            property.push({ "name": countmargin[i].name + " значение", "options": "margin_" + countmargin[i].value, "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        }

        p = document.createElement("p");
        p.innerText = "Внешние поля";
        p.setAttribute("onclick", "baggeteditor.viewProperty('marginProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("marginProperty", property));


        //Положение

        var posElement = ";absolute:Абсолютное;fixed:Фиксированное;relative:Относительно исходного места;static:Обычное;inherit:Значение родителя";
        property = new Array();
        property.push({ "name": "Позиционирования элемента", "options": "position", "arrayvalue": posElement, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Слой (z-index)", "options": "z_index", "arrayvalue": "", "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Ширина элемента", "options": "width", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Max-ширина элемента", "options": "max-width", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Min-ширина элемента", "options": "min-width", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Высота элемента", "options": "height", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Max-высота элемента", "options": "max-height", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Min-высота элемента", "options": "min-height", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Сдвиг элемента вниз", "options": "top", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Сдвиг элемента вверх", "options": "bottom", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Сдвиг элемента вправо", "options": "left", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        property.push({ "name": "Сдвиг элемента влево", "options": "right", "arrayvalue": "", "boolmetric": true, "buttonfunc": null });
        
        p = document.createElement("p");
        p.innerText = "Положение";
        p.setAttribute("onclick", "baggeteditor.viewProperty('positionProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("positionProperty", property));

        //Макет
        var visibilityElem = ";visible:Элемент виден;hidden:Элемента скрыт;collapse:Скрывает табличные элементы;inherit:Значение родителя";
        var displayElem = ";inline;block;list-item;run-in;inline-block;table;inline-table;table-row-group;table-header-group;table-footer-group;table-row;table-column-group;table-column;table-cell;table-caption;none;inherit:Значение родителя";
        var floatElem = ";left:Выравнивание по левому краю;right:Выравнивание по правому краю;none:Нет;inherit:Значение родителя";
        var clearElem = ";both:Запрет обтекания элемента;left:Запрет обтекания с левого края;right:Запрет обтекания с правого края;none:Нет;inherit:Значение родителя";
        var overflow = ";auto;hidden;scroll;visible;inherit";
        property = new Array();
        property.push({ "name": "Видимость элемента", "options": "visibility", "arrayvalue": visibilityElem, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Отображение элемента", "options": "display", "arrayvalue": displayElem, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Обтекание элемента", "options": "float", "arrayvalue": floatElem, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Запрет обтекани другими элементами", "options": "clear", "arrayvalue": clearElem, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Отображение содержимого блочного элемента", "options": "overflow", "arrayvalue": overflow, "boolmetric": false, "buttonfunc": null });
        

        p = document.createElement("p");
        p.innerText = "Макет";
        p.setAttribute("onclick", "baggeteditor.viewProperty('maketProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("maketProperty", property));


        //Список
        var listStyle = ";circle:Маркер в виде кружка;disc:Маркер в виде точки;square:Маркер в виде квадрата;armenian:Традиционная армянская нумерация;decimal:Арабские числа;decimal-leading-zero:Арабские числа с нулем впереди;georgian:Традиционная грузинская нумерация;lower-alpha:Строчные латинские буквы;lower-greek:Строчные греческие буквы;lower-roman:Римские числа в нижнем регистре;upper-alpha:Заглавные латинские буквы;upper-roman:Римские числа в верхнем регистре;none:Нет;inherit:Значение родителя";
        var listPos = ";outside:Отображается за пределами блока;inside:Отображается в элементе списка";
        property = new Array();
        property.push({ "name": "Вид маркера", "options": "list_style_type", "arrayvalue": listStyle, "boolmetric": false, "buttonfunc": null });
        property.push({ "name": "Изображение маркера", "options": "list_style_image", "arrayvalue": "", "boolmetric": false, "buttonfunc": "baggeneral.openDialogSelectImage('list_style_image')" });
        property.push({ "name": "Расположение маркера относительно текста", "options": "list_style_position", "arrayvalue": listPos, "boolmetric": false, "buttonfunc": null });

        p = document.createElement("p");
        p.innerText = "Список";
        p.setAttribute("onclick", "baggeteditor.viewProperty('listProperty')");
        divproperty.appendChild(p);
        divproperty.appendChild(baggeteditor.createProperty("listProperty", property));


        cssEditor.appendChild(divproperty);

        var visualEditor = document.createElement("div");
        visualEditor.setAttribute("id", "view_visual_module");
        visualEditor.setAttribute("class", "view_visual_module");

        cssEditor.appendChild(visualEditor);

        return cssEditor;
    },

    viewProperty: function (idProperty) {        
        var divProp = document.getElementById(idProperty);
        if (divProp.style.display == "none") {
            divProp.setAttribute("style", "display: block;");
        }
        else
            divProp.setAttribute("style", "display: none;");
    },

    createProperty: function(idProperty, property)
    {
        var divproperty = document.createElement("div");        
        for (var i = 0; i < property.length; i++) {
            var d = document.createElement("div");
            var lab = document.createElement("label");
            lab.setAttribute("for", property[i].options);
            lab.innerText = property[i].name;
            d.appendChild(lab);

            if (property[i].arrayvalue != "") {
                var select = document.createElement("select");
                select.setAttribute("id", property[i].options);
                var selectvalue = property[i].arrayvalue.split(";");
                for (var s = 0; s < selectvalue.length; s++) {
                    if (s == 0 ||(s > 0 && selectvalue[s] != "")) {
                        var op = document.createElement("option");
                        op.value = selectvalue[s].split(":")[0];
                        op.innerText = selectvalue[s].split(":").length > 1 ? selectvalue[s].split(":")[1] : selectvalue[s].split(":")[0];
                        select.appendChild(op);
                    }
                }
                d.appendChild(select);
            }
            else {
                var input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("id", property[i].options);
                d.appendChild(input);

                if (property[i].boolmetric) {
                    var metric = baggeteditor.getMetric();
                    metric.setAttribute("id", "for_" + property[i].options);
                    d.appendChild(metric);
                }
                else {
                    if (property[i].buttonfunc != "" && property[i].buttonfunc!=null) {
                        var span = document.createElement("span");
                        span.setAttribute("class", "review_button");
                        span.innerText = "...";
                        span.setAttribute("onclick", property[i].buttonfunc);
                        d.appendChild(span);
                    }
                }
            }
            divproperty.appendChild(d);
        }
        divproperty.setAttribute("style", "display: none;");
        divproperty.setAttribute("class", "property_css");
        divproperty.setAttribute("id", idProperty);
        return divproperty;
    },

    dialogViewCssCode: function (bol) {
        var name_dialog = "dialog_viewcsscode";
        var field_array = new Array();
        field_array.push({ "id": "text_css_code", "type": "textarea", "name": "", "value": "" });

        var button_array = new Array();
        button_array.push({ "name": "Применить", "func": "bagcsseditor.viewCode(); baggeneral.closeSubmenu('" + name_dialog + "');" });
        button_array.push({ "name": "Отмена", "func": "baggeneral.closeSubmenu('" + name_dialog + "');" });

        var submenu = baggeneral.createSubmenu(name_dialog, "CSS код", field_array, button_array, null);

        submenu.setAttribute("class", "view_submenu");
        submenu.style.display = "block";
        document.getElementById("text_css_code").setAttribute("style", "min-width:600px; max-width:900px; min-height: 400px;");
        document.getElementById("text_css_code").value = bagcsseditor.getStyleTeg();
        baggeneral.centerDiv(name_dialog);        
    },

    getMetric: function () {
        var select = document.createElement("select");
        select.setAttribute("class", "editor_css_value_ed");        
        for (var i = 0; i < baggeteditor.metric.length; i++) {
            var op = document.createElement("option");
            op.value = baggeteditor.metric[i];
            op.innerText = baggeteditor.metric[i];
            select.appendChild(op);
        }
        return select;
    },
};