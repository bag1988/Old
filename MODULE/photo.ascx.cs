using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace BAG.module
{
    public partial class photo : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["photo"] != null)
                viewBasePhoto();
            else
                viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                string idPage = "0";
                string maxView = "20"; //максимальное число отображаемых элементов    
                if (Request.QueryString["page"] != null)
                {
                    int id = 0;
                    idPage = Int32.TryParse(Request.QueryString["page"], out id) ? id.ToString() : "0";
                }
                var lis = b.connect("selectPhoto", new string[] { idPage, maxView });
                if (lis.Count > 0)
                {

                    HtmlGenericControl parentDiv = new HtmlGenericControl("div");                    

                    HtmlGenericControl div = new HtmlGenericControl("div");
                    HtmlGenericControl strong = new HtmlGenericControl("strong");
                    HtmlGenericControl p = new HtmlGenericControl("p");

                    for (int i = 0; i < lis.Count; i++)
                    {
                        div = new HtmlGenericControl("div");
                        strong = new HtmlGenericControl("strong");
                        strong.InnerHtml = lis[i].ElementAt(1).Value + "<a href='" + this.Page.Request.FilePath + "?photo=" + lis[i].ElementAt(0).Value + "&namePhoto="+lis[i].ElementAt(1).Value+"'>Все фотографии</a>";

                        div.Controls.Add(strong);

                        p = new HtmlGenericControl("p");
                        p.InnerText = lis[i].ElementAt(2).Value;
                        div.Controls.Add(p);

                        div.Controls.Add(getImages(lis[i].ElementAt(0).Value, 4));

                        parentDiv.Controls.Add(div);
                    }
                    viewContent.Controls.Add(parentDiv);

                    //страничная навигация
                    lis = b.connect("selectPhotoCount", new string[] { });
                    if (lis.Count > 0)
                    {
                        viewContent.Controls.Add(b.getNavigationView(lis[0].ElementAt(0).Value, idPage, Convert.ToInt32(maxView), this.Page.Request.FilePath));
                    }

                }
                else
                {
                    HtmlGenericControl mes = new HtmlGenericControl("span");
                    mes.InnerHtml = "Нет записей!";
                    viewContent.Controls.Add(mes);
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }


        void viewBasePhoto()
        {
            bagClass b = new bagClass();
            try
            {
                string idPhoto = "0";
                if (Request.QueryString["photo"] != null)
                {
                    int id = 0;
                    idPhoto = Int32.TryParse(Request.QueryString["photo"], out id) ? id.ToString() : "0";
                }
                HtmlGenericControl strong = new HtmlGenericControl("strong");
                HtmlGenericControl parentDiv = new HtmlGenericControl("div");
                HtmlGenericControl div = new HtmlGenericControl("div");
                div = new HtmlGenericControl("div");

                div = new HtmlGenericControl("div");
                strong = new HtmlGenericControl("strong");
                strong.InnerText = Request.QueryString["namePhoto"] != null ? Request.QueryString["namePhoto"] : "";

                div.Controls.Add(strong);

                div.Controls.Add(getImages(idPhoto, 0));
                parentDiv.Controls.Add(div);
                viewContent.Controls.Add(parentDiv);

            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        HtmlGenericControl getImages(string idPhoto, int countView)
        {
            bagClass b = new bagClass();
            HtmlGenericControl parentDiv = new HtmlGenericControl("div");
            var lis = b.connect("selectPhotoImg", new string[] { idPhoto });
            if (lis.Count > 0)
            {      
                HtmlGenericControl div = new HtmlGenericControl("div");
                HtmlGenericControl img = new HtmlGenericControl("img");
                if (countView == 0) countView = lis.Count;
                for (int i = 0; i < lis.Count && i < countView; i++)
                {
                    div = new HtmlGenericControl("div");

                    img = new HtmlGenericControl("img");
                    img.Attributes.Add("src", lis[i].ElementAt(3).Value);
                    img.Attributes.Add("alt", lis[i].ElementAt(4).Value);
                    img.Attributes.Add("onclick", "baggeneral.viewBigImg(this)");
                    div.Controls.Add(img);

                    parentDiv.Controls.Add(div);
                }
            }
            return parentDiv;
        }

    }
}