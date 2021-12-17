using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace BAG.module
{
    public partial class video : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["video"] != null)
                viewBaseVideo();
            else
                viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                string idPage = "0";
                string maxView = "10"; //максимальное число отображаемых элементов    
                if (Request.QueryString["page"] != null)
                {
                    int id = 0;
                    idPage = Int32.TryParse(Request.QueryString["page"], out id) ? id.ToString() : "0";
                }
                var lis = b.connect("selectVideo", new string[] { idPage, maxView });
                if (lis.Count > 0)
                {

                    HtmlGenericControl parentDiv = new HtmlGenericControl("div");

                    HtmlGenericControl div = new HtmlGenericControl("div");
                    HtmlGenericControl span = new HtmlGenericControl("span");
                    HtmlGenericControl strong = new HtmlGenericControl("strong");
                    HtmlGenericControl p = new HtmlGenericControl("p");

                    for (int i = 0; i < lis.Count; i++)
                    {
                        div = new HtmlGenericControl("div");
                        strong = new HtmlGenericControl("strong");
                        strong.InnerHtml = lis[i].ElementAt(1).Value + "<a href='" + this.Page.Request.FilePath + "?video=" + lis[i].ElementAt(0).Value + "&nameVideo=" + lis[i].ElementAt(1).Value + "'>Все видеозаписи</a>";

                        div.Controls.Add(strong);

                        p = new HtmlGenericControl("p");
                        p.InnerText = lis[i].ElementAt(2).Value;
                        div.Controls.Add(p);

                        div.Controls.Add(getImages(lis[i].ElementAt(0).Value, 4));

                        parentDiv.Controls.Add(div);
                    }
                    viewContent.Controls.Add(parentDiv);

                    //страничная навигация
                    lis = b.connect("selectVideoCount", new string[] { });
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

        void viewBaseVideo()
        {
            bagClass b = new bagClass();
            try
            {
                string idPhoto = "0";
                if (Request.QueryString["video"] != null)
                {
                    int id = 0;
                    idPhoto = Int32.TryParse(Request.QueryString["video"], out id) ? id.ToString() : "0";
                }
                HtmlGenericControl strong = new HtmlGenericControl("strong");
                HtmlGenericControl parentDiv = new HtmlGenericControl("div");
                HtmlGenericControl div = new HtmlGenericControl("div");
                div = new HtmlGenericControl("div");

                div = new HtmlGenericControl("div");
                strong = new HtmlGenericControl("strong");
                strong.InnerText = Request.QueryString["nameVideo"] != null ? Request.QueryString["nameVideo"] : "";

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

        HtmlGenericControl getImages(string idVideo, int countView)
        {
            bagClass b = new bagClass();
            HtmlGenericControl parentDiv = new HtmlGenericControl("div");
            try
            {
                var lis = b.connect("selectVideoList", new string[] { idVideo });
                if (lis.Count > 0)
                {
                    HtmlGenericControl div = new HtmlGenericControl("div");
                    HtmlGenericControl span = new HtmlGenericControl("span");
                    HtmlGenericControl videoplayer = new HtmlGenericControl("div");
                    HtmlGenericControl p = new HtmlGenericControl("p");
                    if (countView == 0) countView = lis.Count;
                    for (int i = 0; i < lis.Count&&i<countView; i++)
                    {
                        div = new HtmlGenericControl("div");

                        videoplayer = new HtmlGenericControl("div");
                        videoplayer.InnerHtml = "<embed src='http://s3.spruto.org/embed/player.swf' type='application/x-shockwave-flash' allowfullscreen='true' allowScriptAccess='always' flashvars='set_video1_url=" + lis[i].ElementAt(2).Value + "'/>  ";
                        div.Controls.Add(videoplayer);

                        p = new HtmlGenericControl("p");
                        p.InnerText = lis[i].ElementAt(3).Value;
                        div.Controls.Add(p);

                        parentDiv.Controls.Add(div);
                    }
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
            return parentDiv;
        }

    }
}