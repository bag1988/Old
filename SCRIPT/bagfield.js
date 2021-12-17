var bagfield = {
    createButtonArray: function (button_array, className) {
        var button_menu = document.createElement("div");
        if (className)
            button_menu.setAttribute("class", className);
        for (var i = 0; i < button_array.length; i++) {            
            button_menu.appendChild(bagfield.createButton(button_array[i].name, button_array[i].func));
        }

        return button_menu;
    },
    createButton: function(nameButton, func){
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("onclick", func);
        button.setAttribute("value", nameButton);

        return button;
    },
    createField: function (field_array, className) {
        var arrayField = document.createElement("div");
        for (var i = 0; i < field_array.length; i++) {
            var div_field = document.createElement("div");
            if (className)//применяем класс
                div_field.setAttribute("class", className);
            //добавляем label
            if (field_array[i].name) {
                div_field.appendChild(bagfield.createLabel(field_array[i].id, field_array[i].name, field_array[i].infoField));
            }
            switch (field_array[i].type) {
                case "select":
                    div_field.appendChild(bagfield.createSelect(field_array[i].id, field_array[i].value));
                    break;
                case "text":
                    div_field.appendChild(bagfield.createText(field_array[i].id, field_array[i].value));
                    break;
                case "textarea":
                    div_field.appendChild(bagfield.createTextarea(field_array[i].id, field_array[i].value));
                    break;
            }            
            arrayField.appendChild(div_field);
        }
        return arrayField;
    },
    createLabel: function(idField, nameField, infoField){
        var field = document.createElement("label");
        field.setAttribute("for", idField);
        var inf = (!infoField) ? "" : "<i>" + infoField + "</i>";
        field.innerHTML = nameField + inf;
        return field;
    },
    createText: function (idField, defaultValue) {
        var field = document.createElement("input");
        field.setAttribute("id", idField);
        field.setAttribute("type", "text");
        field.value = defaultValue;
        return field;
    },
    createTextarea: function (idField, defaultValue) {
        var field = document.createElement("textarea");
        field.setAttribute("id", idField);
        field.value = defaultValue;
        return field;
    },
    createSelect: function (idField, valueArray) {
        var field = document.createElement("select");
        field.setAttribute("id", idField);
        var value_array = valueArray.split(';');
        for (var b = 0; b < value_array.length; b++) {
            var op = document.createElement("option");
            op.setAttribute("value", value_array[b].split(':').length == 2 ? value_array[b].split(':')[0] : value_array[b]);
            op.innerText = value_array[b].split(':').length == 2 ? value_array[b].split(':')[1] : value_array[b];
            field.appendChild(op);
        }
        return field;
    },

    createImageBlock: function (idField, nameField, changeFuc, infoField) {
        var divImages = document.createElement("div");
        if (nameField)
            divImages.appendChild(bagfield.createLabel(idField, nameField, infoField));
        divImages.appendChild(bagfield.createFile(idField, changeFuc));
        return divImages;
    },
    createFile: function (idField, changeFuc) {
        var field = document.createElement("input");
        field.setAttribute("id", idField);
        field.setAttribute("type", "file");
        field.setAttribute("onchange", changeFuc);        
        return field;
    },
};
var bagRegexp = [];
//var bagRegexp = {
//    idField={
//        isNull: null,
//        exp: null,
//        message: null
//    }
//};