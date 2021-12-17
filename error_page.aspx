<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Theme="theme1" CodeBehind="error_page.aspx.cs" Inherits="BAG.error_page" %>

<%@ Register src="admin/module/top.ascx" tagname="top" tagprefix="uc1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
</head>
<body class="adminbody">
    <form id="form1" runat="server">
    <div class="admin_top">    
        <uc1:top ID="top1" runat="server" />    
    </div>
    <div id="error_div" style="text-align: center; color: red; font-size: 24px;" runat="server">
    
    </div>
    </form>
</body>
</html>
