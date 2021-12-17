<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="edit_options_page.aspx.cs" Inherits="BAG.admin.edit_options_page" %>

<%@ Register src="module/top.ascx" tagname="top" tagprefix="uc1" %>

<%@ Register src="module/left_menu.ascx" tagname="left_menu" tagprefix="uc2" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Свойство страницы</title>
</head>
<body class="adminbody">
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
                <td>Наименование</td>
                <td><asp:TextBox ID="name_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Доступность</td>
                <td>
                    <select id="page_roles" runat="server">
                        <option value="all">Всем</option>
                        <option value="register">Зарегистрированным пользователям</option>
                        <option value="admin">Только администратору</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Заголовок</td>
                <td><asp:TextBox ID="title_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Описание</td>
                <td><asp:TextBox ID="meta_txt" TextMode="MultiLine" Rows="5" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Ключевые слова</td>
                <td><asp:TextBox ID="key_txt" TextMode="MultiLine" Rows="5" runat="server"></asp:TextBox></td>
            </tr>            
        </table>
        <div class="adminButton">            
             <asp:LinkButton ID="save_button" runat="server" OnClick="save_button_Click">Сохранить</asp:LinkButton>
            <a href="view_page.aspx">Отмена</a>
        </div>
    </div>
    
    </form>
</body>
</html>
