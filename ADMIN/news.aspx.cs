using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.IO;

namespace BAG.admin
{
    public partial class news : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }
            else
            {
                if (Request.Params["deleteNews"] != null)
                    deleteNews();                
            }

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
                var lis = b.connect("selectNews", new string[] { idPage, maxView });
                if (lis.Count > 0)
                {
                    Table tab = new Table();
                    tab.CssClass = "admin_table";
                    TableCell cel = new TableCell();
                    TableRow row = new TableRow();
                    LinkButton link = new LinkButton();
                    //строка заголовков
                    admin ad = new admin();
                    Dictionary<string, int> dHeader = new Dictionary<string, int>();
                    dHeader.Add("Наименование", 25);
                    dHeader.Add("Краткое описание", 45);
                    dHeader.Add("Действие", 30);
                    tab.Rows.Add(ad.createHeaderRow(dHeader));

                    HtmlGenericControl span;
                    for (int i = 0; i < lis.Count; i++)
                    {
                        row = new TableRow();
                        cel = new TableCell();
                        cel.Text = lis[i].ElementAt(1).Value;
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        cel.Text = lis[i].ElementAt(4).Value;
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        span = new HtmlGenericControl("span");
                        span.Attributes.Add("onclick", "bagnews.deleteNews('" + lis[i].ElementAt(0).Value + "')");
                        span.InnerText = "Удалить";

                        cel.Controls.Add(span);
                        row.Cells.Add(cel);

                        span = new HtmlGenericControl("a");
                        span.Attributes.Add("href", "editNews.aspx?news=" + lis[i].ElementAt(0).Value);
                        span.InnerText = "Редактировать";

                        cel.Controls.Add(span);
                        row.Cells.Add(cel);

                        tab.Rows.Add(row);

                    }
                    view_base.Controls.Add(tab);

                    //страничная навигация
                    lis = b.connect("selectNewsCount", new string[] { });
                    if (lis.Count > 0)
                    {
                        view_base.Controls.Add(b.getNavigationView(lis[0].ElementAt(0).Value, idPage, Convert.ToInt32(maxView), this.Page.Request.FilePath));
                    }

                }
                else
                {
                    HtmlGenericControl mes = new HtmlGenericControl("span");
                    mes.InnerHtml = "Нет записей!";
                    view_base.Controls.Add(mes);
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        void deleteNews()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["deleteNews"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    b.connect("deleteNews", new string[] { id.ToString() });
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }
    }
}
