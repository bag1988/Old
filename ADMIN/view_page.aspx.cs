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
    public partial class view_page : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            bagClass b = new bagClass();
            if (b.get_role() != "admin")
            {
                Response.Redirect("default.aspx");
            }            
            viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                var lis = b.connect("get_pages");
                if (lis.Count > 0)
                {
                    Table tab = new Table();
                    tab.CssClass = "admin_table";
                    TableCell cel = new TableCell();
                    TableRow row = new TableRow();                    
                    LinkButton link = new LinkButton();
                    //строка заголовков
                    admin ad = new admin();
                    Dictionary<string, int> dHeader = new Dictionary<string,int>();
                    dHeader.Add("Наименование", 30);
                    dHeader.Add("Доступность", 35);
                    dHeader.Add("Действие", 35);
                    tab.Rows.Add(ad.createHeaderRow(dHeader));
                    
                    HtmlGenericControl a;
                    HtmlGenericControl span;
                    for (int i = 0; i < lis.Count; i++)
                    {
                        row = new TableRow();
                        cel = new TableCell();                        
                        a = new HtmlGenericControl("a");
                        a.Attributes.Add("href", "../"+ lis[i].ElementAt(2).Value);
                        a.InnerText = lis[i].ElementAt(1).Value;
                        cel.Controls.Add(a);
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        cel.Text= lis[i].ElementAt(3).Value=="all"?"Все": lis[i].ElementAt(3).Value=="admin"? "Администратор":"Зарегистрированные пользователи";
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        span = new HtmlGenericControl("span");
                        span.Attributes.Add("onclick", "bagrequest.deletePage('" + lis[i].ElementAt(0).Value + "')");
                        span.InnerText = "Удалить";
                        cel.Controls.Add(span);
                        row.Cells.Add(cel);  

                        a = new HtmlGenericControl("a");
                        a.Attributes.Add("href", "edit_options_page.aspx?page=" + lis[i].ElementAt(0).Value);
                        a.InnerText = "Редактировать";
                        cel.Controls.Add(a);
                        row.Cells.Add(cel);   

                        tab.Rows.Add(row);
                        
                    }
                    view_base.Controls.Add(tab);
                }
            }
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }
    }
}
