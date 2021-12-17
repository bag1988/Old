<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="editArticle.aspx.cs" Inherits="BAG.admin.editArticle" %>

<%@ Register src="module/top.ascx" tagname="top" tagprefix="uc1" %>

<%@ Register src="module/left_menu.ascx" tagname="left_menu" tagprefix="uc2" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Статьи</title>
</head>
<body class="adminbody" onload="bagarticle.insertIframe();">
    <form id="form1" runat="server">
        <uc2:left_menu ID="left_menu1" runat="server" />
        <uc1:top ID="top1" runat="server" />
        
    <div class="admin_right" id="view_base" runat="server">
        <table class="admin_table">
            <tr>
                <th style="width: 30%;">Наименование</th>
                <th style="width: 70%;">Значение</th>
            </tr>
            <tr>
                <td>Наименование*</td>
                <td><asp:TextBox ID="name_txt" runat="server"></asp:TextBox></td>
            </tr> 
            <tr>
                <td>Краткое описание*</td>
                <td><asp:TextBox ID="short_txt" TextMode="MultiLine" Rows="5" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Ключевые слова</td>
                <td><asp:TextBox ID="key_txt" TextMode="MultiLine" Rows="5" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Полный текст*</td>
                <td>
                    <div class="divmultiline">
                        <div id="editor_normal" class="editor_normal" style="display:block;"></div>
                        <div id="text_html" runat="server">Введите полное описание</div>
                    </div>
                </td>
                       
            </tr>            
        </table>
        <div class="adminButton">            
            <span id="saveButton" runat="server" onclick="bagarticle.saveNewArticle('-1')">Сохранить</span>
            <a href="article.aspx">Отмена</a>
        </div>
    </div>
    
    </form>
</body>
</html>
