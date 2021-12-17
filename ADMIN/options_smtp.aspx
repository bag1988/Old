<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="options_smtp.aspx.cs" Inherits="BAG.admin.options_smtp" %>

<%@ Register src="module/top.ascx" tagname="top" tagprefix="uc1" %>

<%@ Register src="module/left_menu.ascx" tagname="left_menu" tagprefix="uc2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Настройки SMTP</title>
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
                <td>Сервер</td>
                <td><asp:TextBox ID="server_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Порт</td>
                <td><asp:TextBox ID="port_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Логин</td>
                <td><asp:TextBox ID="login_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Пароль</td>
                <td><asp:TextBox ID="password_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Email</td>
                <td><asp:TextBox ID="email_txt" runat="server"></asp:TextBox></td>
            </tr>  
            <tr>
                <td>Использовать SSL</td>
                <td><asp:CheckBox ID="ssl_text" runat="server" /></td>
            </tr>          
        </table>
    <div class="adminButton">
            <asp:Button ID="save_button" CssClass="admin_button" runat="server" Text="Сохранить" onclick="save_button_Click" />                        
        </div>
    </div>
    
    </form>
</body>
</html>
