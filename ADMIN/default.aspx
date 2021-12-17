<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="BAG.admin._default" %>
<%@ Register src="module/top.ascx" tagname="top" tagprefix="uc1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Авторизация</title>
</head>
<body onload="baggeneral.centerDiv('adminLogin')" class="adminbody">
    <form id="form1" runat="server">
        <uc1:top ID="top1" runat="server" />
        <div class="adminLogin" id="adminLogin">
            <div class="adminLoginDiv">
                <h1>Вход</h1>
                <div class="errormeessage" id="errormeessage" runat="server"></div>
                <div class="adminLogindiv">
                    <label for="userName">Логин</label>
                    <input type="text" name="userName" id="userName"/>        
                </div> 
                <div class="adminLogindiv">
                    <label for="userPassword">Пароль</label>
                    <input type="password" name="userPassword" id="userPassword"/>        
                </div>
            </div>
            <div class="adminLoginbutton">
                <input type="submit" value="Войти" />
            </div>             
        </div>
    </form>
</body>
</html>
