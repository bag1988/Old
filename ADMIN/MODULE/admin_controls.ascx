<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="admin_controls.ascx.cs" Inherits="BAG.module.admin_controls" %>
<div id="admin_div_controls" runat="server">    
        <div class="admin_panel" id="admin_panel">            
            <div class="admin_panel_menu">
                <span onclick="bagrequest.addPage();">Новая страница</span>
                <span onclick="bagrequest.addExten('form');">Расширения</span>
                <span onclick="bagrequest.newTemplates();">Сохранить как шаблон</span>
                <a href="/admin/view_page.aspx">Панель администрирования</a> 
                <asp:LinkButton ID="editMode" runat="server" onclick="editMode_Click">Режим редактирования</asp:LinkButton>
                <span onclick="bagrequest.exitUser();">Выйти</span>
                <asp:HiddenField ID="editModeBool" runat="server" />
            </div>    
            <div>
                <div id="editor_normal" class="editor_normal"></div>
            </div>
        </div>
</div>