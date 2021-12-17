<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="news.aspx.cs" Inherits="BAG.admin.news" %>

<%@ Register src="module/top.ascx" tagname="top" tagprefix="uc1" %>

<%@ Register src="module/left_menu.ascx" tagname="left_menu" tagprefix="uc2" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Новости</title>
</head>
<body class="adminbody">
    <form id="form1" runat="server">
        <uc2:left_menu ID="left_menu1" runat="server" />     
        <uc1:top ID="top1" runat="server" />
    <div class="admin_right" id="view_base" runat="server" >        
        <div class="adminButton">
            <a href="editnews.aspx">Добавить</a>   
        </div>
    </div>
    </form>
</body>
</html>
