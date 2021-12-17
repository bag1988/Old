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
    public partial class view_save_property : System.Web.UI.Page
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
                if (Request.Params["getUnsedCss"] != null)
                    getUnsedCss();
                if (Request.Params["deleteUnsedCss"] != null)
                    deleteUnsedCss();
                viewBase();
            }
        }

        void deleteUnsedCss()
        {
            try
            {
                bagClass b = new bagClass();
                var lis = b.connect("getUnsedCss");

                if (new DirectoryInfo(Server.MapPath("/App_Themes/theme1/user_theme")).Exists)
                {
                    FileInfo[] f = new DirectoryInfo(Server.MapPath("/App_Themes/theme1/user_theme")).GetFiles("*.css", SearchOption.AllDirectories);
                    if (f.Length > 0)
                    {
                        if (lis.Count > 0)
                        {
                            for (int i = 0; i < f.Length; i++)
                            {
                                if (!lis.Exists(x => x.ContainsValue(f[i].Name.Replace(".css", ""))))
                                {
                                    File.Delete(Server.MapPath("/App_Themes/theme1/user_theme") + "/" + f[i].Name);
                                }
                            }
                        }
                        else
                        {
                            for (int i = 0; i < f.Length; i++)
                            {
                                File.Delete(Server.MapPath("/App_Themes/theme1/user_theme") + "/" + f[i].Name);
                            }
                        }
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void getUnsedCss()
        {
            try
            {
                this.form1.InnerHtml = "";
                bagClass b = new bagClass();
                var lis = b.connect("getUnsedCss");

                if (new DirectoryInfo(Server.MapPath("/App_Themes/theme1/user_theme")).Exists)
                {
                    FileInfo[] f = new DirectoryInfo(Server.MapPath("/App_Themes/theme1/user_theme")).GetFiles("*.css", SearchOption.AllDirectories);
                    if (f.Length > 0)
                    {
                        if (lis.Count > 0)
                        {
                            for (int i = 0; i < f.Length; i++)
                            {
                                if (!lis.Exists(x => x.ContainsValue(f[i].Name.Replace(".css", ""))))
                                {
                                    this.form1.InnerHtml += "<unsedCss>";
                                    this.form1.InnerHtml += "<nameCss>" + f[i].Name + "</nameCss>";
                                    this.form1.InnerHtml += "</unsedCss>";
                                }
                            }
                        }
                        else
                        {
                            for (int i = 0; i < f.Length; i++)
                            {
                                this.form1.InnerHtml += "<unsedCss>";
                                this.form1.InnerHtml += "<nameCss>" + f[i].Name + "</nameCss>";
                                this.form1.InnerHtml += "</unsedCss>";
                            }
                        }
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                string strExten = Request.QueryString["nameExten"] != null ? Request.QueryString["nameExten"] : "";
                string strName = Request.QueryString["nameSave"] != null ? Request.QueryString["nameSave"] : "";
                var lis = b.connect("getAllSaveProperty", new string[] { strExten ,strName });
                if (lis.Count > 0)
                {
                    Table tab = new Table();
                    tab.CssClass = "admin_table";
                    TableCell cel = new TableCell();
                    TableRow row = new TableRow();
                    TableHeaderCell hcel = new TableHeaderCell();
                    LinkButton link = new LinkButton();
                    //строка заголовков
                    hcel = new TableHeaderCell();
                    hcel.Text = "Наименование настройки";
                    row.Cells.Add(hcel);

                    hcel = new TableHeaderCell();
                    hcel.Text = "Применимо к расширению";
                    row.Cells.Add(hcel);

                    hcel = new TableHeaderCell();
                    hcel.Text = "Действие";
                    row.Cells.Add(hcel);

                    tab.Rows.Add(row);
                    for (int i = 0; i < lis.Count; i++)
                    {
                        row = new TableRow();

                        cel = new TableCell();
                        cel.Text = lis[i].ElementAt(2).Value;
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        cel.Text = lis[i].ElementAt(1).Value;
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        link = new LinkButton();
                        link.Text = "Удалить";
                        link.ID = "deleteTemplates_" + lis[i].ElementAt(0).Value;
                        link.Click += link_Click;
                        cel.Controls.Add(link);
                        row.Cells.Add(cel);

                        tab.Rows.Add(row);

                    }
                    view_base.Controls.Add(tab);
                }
                else
                {
                    HtmlGenericControl mes = new HtmlGenericControl("span");
                    mes.InnerHtml = "Нет расширений!";
                    view_base.Controls.Add(mes);
                }
            }
            catch (Exception ex)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(ex.Message), true);
            }
        }

        void link_Click(object sender, EventArgs e)
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse((sender as LinkButton).ID.Split('_')[1], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    b.connect("deleteSaveProperty", new string[] { id.ToString() });
                    
                }
            }
            catch (Exception ex)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(ex.Message), true);
            }
            Response.Redirect(Request.RawUrl);
        }
    }
}
