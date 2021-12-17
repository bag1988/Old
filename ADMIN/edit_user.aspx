<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="edit_user.aspx.cs" Inherits="BAG.admin.edit_user" %>

<%@ Register src="module/top.ascx" tagname="top" tagprefix="uc1" %>

<%@ Register src="module/left_menu.ascx" tagname="left_menu" tagprefix="uc2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Редоктирование данных пользователей</title>
</head>
<body class="adminbody">
    <form id="form1" runat="server">
    <uc2:left_menu ID="left_menu1" runat="server" /> 
        <uc1:top ID="top1" runat="server" />
    <div class="admin_right">
        <div class="editUser">
            <asp:ValidationSummary ID="validationsummary_r" style="text-align: left;" runat="server" 
                ValidationGroup="registration" />
            <asp:Label ID="error_lb" runat="server" Visible="false" style="text-align: left; display: block; color: Red;" Text=""></asp:Label>    
            <div id="view_base" runat="server">
           
            </div>            
        </div>
        <div class="adminButton">
            <asp:Button ID="registration_button" runat="server" Text="Изменить" 
                onclick="registration_button_Click" ValidationGroup="registration" />
        </div>
    </div>
    </form>
</body>
</html>
