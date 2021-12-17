var bagmoving = {
    getArrayDiv: function (elem) {
        var parent_div = elem.parentNode;
        var array_div = new Array();

        for (var i = 0; i < parent_div.childNodes.length; i++) {
            if (/^\d+\_container$/i.test(parent_div.childNodes[i].id) && parent_div.childNodes[i] != elem)
                array_div.push({ "elem": parent_div.childNodes[i], "top": baggeneral.getOffset(parent_div.childNodes[i]).top, "left": baggeneral.getOffset(parent_div.childNodes[i]).left, "height": parent_div.childNodes[i].offsetHeight, "width": parent_div.childNodes[i].offsetWidth });
        }
        return array_div;
    },

    movingContainer: function (event) {
        event = baggeneral.fixEvent(event);        
        var this_el = event.target || event.srcElement;        
        if (!this_el) return;
        if (event.which != 1) return;

        if (!/\d+\_edit/.test(this_el.id)) return;
        var parent_div = document.getElementById(this_el.id.match(/\d+/)[0] + "_container");
        parent_div.setAttribute("style", "filter: alpha(opacity=60); opacity:0.6; outline:dashed 3px #ff4200;");
        var page_y = event.pageY;
        var page_x = event.pageX;
        if (document.body.style.marginTop!="") {
            page_y = page_y - parseInt(document.body.style.marginTop);
        }
        var array_div;
        var avatar_div = document.createElement("div");
        avatar_div.id = "avatar_div";
        avatar_div.setAttribute("class", "avatar_div");
        avatar_div.setAttribute("style", "top:" + (page_y - 25) + "px; left:" + (page_x - 82) + "px;");
        parent_div.parentNode.appendChild(avatar_div);
        var mouseOffset = getMouseOffset(avatar_div, page_x, page_y);

        

        function mouseMove(e) {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else {
                document.selection.empty();
            }
            e = baggeneral.fixEvent(e);

            // (1)
            if (mouseOffset) {
                if (Math.abs(event.x - e.pageX) < 10 && Math.abs(event.y - e.pageY) < 10) {
                    return false;
                }

                array_div = bagmoving.getArrayDiv(parent_div);
                var new_y = e.pageY - mouseOffset.y, new_x = e.pageX - mouseOffset.x;
                if (document.body.style.marginTop != "") {
                    new_y = new_y - parseInt(document.body.style.marginTop)*2;
                }
                avatar_div.style.top = new_y + 'px';
                avatar_div.style.left = new_x + 'px';

                for (var i = 0; i < array_div.length; i++) {
                    if (e.pageY > (array_div[i].top + array_div[i].height * 0.2) && e.pageY < (array_div[i].top + array_div[i].height * 0.8)) {
                        if (page_y > new_y) {
                            parent_div.parentNode.insertBefore(parent_div, array_div[i].elem); break;
                        }
                        if (page_y < new_y) {
                            parent_div.parentNode.insertBefore(parent_div, array_div[i].elem.nextSibling); break;
                        }
                    }
                }
                page_y = new_y;
            }

            return false;
        }

        function mouseUp() {
            this_el = null;
            parent_div.parentNode.removeChild(avatar_div);
            mouseOffset = null;
            avatar_div = null;
            page_y = null;


            var id_array_module = new Array();

            for (var i = 0; i < parent_div.parentNode.childNodes.length; i++) {
                if (/^\d+\_container$/i.test(parent_div.parentNode.childNodes[i].id)) {
                    id_array_module.push(parent_div.parentNode.childNodes[i].id.match(/\d+/)[0]);
                }
            }
            parent_div.removeAttribute("style");
            parent_div = null;
            bagrequest.updatePositionModule(id_array_module);
            id_array_module = null;
            document.onmousemove = document.onmouseup =  null;
        }

        function getMouseOffset(target, x, y) {
            var docPos = baggeneral.getOffset(target)
            return { x: x - docPos.left, y: y - docPos.top };
        }
        document.onmousemove = mouseMove;
        document.onmouseup = mouseUp;

        return false;
    },
};