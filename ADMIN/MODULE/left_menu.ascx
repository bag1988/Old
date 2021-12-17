<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="left_menu.ascx.cs" Inherits="BAG.admin.module.left_menu" %>
<div class="admin_left_menu" id="adminLeftPanel">
    <p>Панель админисратора</p>
    <div class="navigationMenu">
        <div class="navigationDiv">
            <a href="../default.aspx">Сайт</a>
            <a href="view_page.aspx">Страницы</a>
            <a href="templates.aspx">Шаблоны</a>
            <a href="view_save_property.aspx">Настройки расширений</a>
            <a href="options_smtp.aspx">Настройки SMTP</a>
            <a href="options_site.aspx">О компании</a>
            <a href="extend.aspx">Расширения</a>
            <a href="users.aspx">Пользователи</a>
            <a href="news.aspx">Новости</a>
            <a href="article.aspx">Статьи</a>
            <a href="photo.aspx">Фотогалерея</a>
            <a href="video.aspx">Видеогалерея</a>
            <span onclick="bagrequest.exitUser();">Выйти</span>
            
        </div>
        <div id="dynamicOptions" class="navigationDiv">

        </div>
    </div>
</div>