using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

namespace BAG.module
{
    public partial class blockvideo : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {            
             viewBase();
        }

        void viewBase()
        {
            try
            {
                string idPage = "0";
                string maxView = ""; //максимальное число отображаемых элементов
                string pageView = "";
                string nameBlock = "";
                bagClass b = new bagClass();
                var lis = b.connect("selectOptionsBlock", new string[] { this.ID });
                if (lis.Count > 0)
                {
                    for (int i = 0; i < lis.Count; i++)
                    {
                        switch (lis[i].ElementAt(2).Value)
                        {
                            case "pageView": pageView = lis[i].ElementAt(3).Value; break;
                            case "nameBlock": nameBlock = lis[i].ElementAt(3).Value; break;
                            case "maxView": maxView = lis[i].ElementAt(3).Value; break;
                        }
                    }
                }
                if (maxView == "")
                    maxView = "3";
                lis = b.connect("selectLastVideo", new string[] { idPage, maxView });
                HtmlGenericControl parentDiv = new HtmlGenericControl("div");
                if (lis.Count > 0)
                {
                    HtmlGenericControl a = new HtmlGenericControl("a");
                    if (nameBlock != "")
                    {
                        a = new HtmlGenericControl("a");
                        a.Attributes.Add("href", pageView);
                        a.InnerText = nameBlock;
                        viewContent.Controls.Add(a);
                    }
                    HtmlGenericControl div = new HtmlGenericControl("div");
                    HtmlGenericControl videoplayer = new HtmlGenericControl("div");
                    HtmlGenericControl p = new HtmlGenericControl("p");
                    for (int i = 0; i < lis.Count; i++)
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
                    viewContent.Controls.Add(parentDiv);
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }
    }
}