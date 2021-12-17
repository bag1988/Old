<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="options_site.aspx.cs" Inherits="BAG.admin.options_site" %>

<%@ Register src="module/top.ascx" tagname="top" tagprefix="uc1" %>

<%@ Register src="module/left_menu.ascx" tagname="left_menu" tagprefix="uc2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Информация о компании</title>
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
                <td>Наименование компании</td>
                <td><asp:TextBox ID="name_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Контактное лицо</td>
                <td><asp:TextBox ID="contact_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Описание</td>
                <td><asp:TextBox ID="description_txt" TextMode="MultiLine" Rows="5" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Адрес</td>
                <td><asp:TextBox ID="adres_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Веб-сайт</td>
                <td><asp:TextBox ID="url_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Телефон 1</td>
                <td><asp:TextBox ID="phone1_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Телефон 2</td>
                <td><asp:TextBox ID="phone2_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Факс</td>
                <td><asp:TextBox ID="fax_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Email</td>
                <td><asp:TextBox ID="email_txt" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>Skype</td>
                <td><asp:TextBox ID="skype_txt" runat="server"></asp:TextBox></td>
            </tr>            
            
        </table>
        <div class="adminButton">
            <asp:Button ID="save_button" CssClass="admin_button" runat="server" Text="Сохранить" onclick="save_button_Click" />
                        
        </div>
    </div>
    
    </form>
</body>
</html>
