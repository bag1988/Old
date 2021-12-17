using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.IO;
using System.IO.Compression;

namespace BAG.admin
{
    public partial class extend : System.Web.UI.Page
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
                if (Request.Params["nameFunc"] != null && Request.Params["valueFunc"] != null && Request.Params["idFunc"] != null)
                    saveFuncExtend();
                if (Request.Params["idUpdateExtend"] != null && Request.Params["updateNameExtend"] != null && Request.Params["updateTextExtend"] != null)
                    updateExtend();
                if (Request.Params["nameExtend"] != null && Request.Params["textExtend"] != null)
                    saveNewExtend();
                if (Request.Params["idExtend"] != null)
                    deleteExtend();
                if (Request.Params["editExtend"] != null)
                    getInfoExtend();
                if (Request.Params["funcExtend"] != null)
                    getFuncExtend();
                if (Request.Params["deleteFuncExtend"] != null)
                    deleteFuncExtend();
                viewBase();
            }
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                var lis = b.connect("get_module");
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
                    dHeader.Add("Описание", 45);
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
                        cel.Text = lis[i].ElementAt(2).Value;
                        row.Cells.Add(cel);

                        cel = new TableCell();
                        span = new HtmlGenericControl("span");
                        span.Attributes.Add("onclick", "bagextend.deleteExtend('" + lis[i].ElementAt(0).Value + "')");
                        span.InnerText = "Удалить";

                        cel.Controls.Add(span);
                        row.Cells.Add(cel);

                        span = new HtmlGenericControl("span");
                        span.Attributes.Add("onclick", "bagextend.editFunc('" + lis[i].ElementAt(0).Value + "')");
                        span.InnerText = "Настройки";

                        cel.Controls.Add(span);
                        row.Cells.Add(cel);

                        span = new HtmlGenericControl("span");
                        span.Attributes.Add("onclick", "bagextend.editExtend('" + lis[i].ElementAt(0).Value + "')");
                        span.InnerText = "Редактировать";

                        cel.Controls.Add(span);
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
            catch (Exception er)
            {
                Response.Redirect("../error_page.aspx?error_message=" + HttpUtility.UrlEncode(er.Message), true);
            }
        }

        void deleteExtend()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["idExtend"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    b.connect("deleteModule", new string[] { id.ToString() });                    
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void deleteFuncExtend()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["deleteFuncExtend"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    b.connect("deleteFuncExtend", new string[] { id.ToString() });
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void saveNewExtend()
        {
            try
            {                
                string nameExtend = Request.Params["nameExtend"];
                string textExtend = Request.Params["textExtend"];
                string defaultHtml = Request.Params["defaultHTML"] != null ? Request.Params["defaultHTML"] : "";
                string defaultCss = Request.Params["defaultCss"] != null ? Request.Params["defaultCss"] : "";
                string scriptExtend = Request.Params["scriptExtend"] != null ? Request.Params["scriptExtend"] : "";
                if (nameExtend != "" && textExtend != "")
                {
                    bagClass b = new bagClass();
                    b.connect("insertModule", new string[] { nameExtend, textExtend, defaultHtml, defaultCss, scriptExtend });
                }
            }
            catch (Exception ex)
            {
                this.form1.InnerHtml = "<error>" + ex.Message + "</error>";
            }
        }

        void updateExtend()
        {
            try
            {
                int i = 0;
                int id = Int32.TryParse(Request.Params["idUpdateExtend"], out i) ? i : 0;               
                string nameExtend = Request.Params["updateNameExtend"];
                string textExtend = Request.Params["updateTextExtend"];
                string defaultHtml = Request.Params["updateDefaultHTML"] != null ? Request.Params["updateDefaultHTML"] : "";
                string defaultCss = Request.Params["updateDefaultCss"] != null ? Request.Params["updateDefaultCss"] : "";
                string scriptExtend = Request.Params["updateScriptExtend"] != null ? Request.Params["updateScriptExtend"] : "";
                if (id != 0 && nameExtend != "" && textExtend != "")
                {
                    bagClass b = new bagClass();
                    b.connect("updateModule", new string[] { id.ToString(), nameExtend, textExtend, defaultHtml, defaultCss, scriptExtend });
                }
            }
            catch (Exception ex)
            {
                this.form1.InnerHtml = "<error>" + ex.Message + "</error>";
            }
        }

        void getInfoExtend()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["editExtend"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("get_module_info", new string[] { id.ToString() });
                    if (lis.Count > 0)
                    {
                        this.form1.InnerHtml += "<exten>";
                        this.form1.InnerHtml += "<nameExten>" + lis[0].ElementAt(1).Value + "</nameExten>";
                        this.form1.InnerHtml += "<textExten>" + lis[0].ElementAt(2).Value + "</textExten>";
                        this.form1.InnerHtml += "<htmlExten>" + lis[0].ElementAt(3).Value + "</htmlExten>";
                        this.form1.InnerHtml += "<cssExten>" + lis[0].ElementAt(4).Value + "</cssExten>";
                        this.form1.InnerHtml += "<scriptExtend>" + lis[0].ElementAt(5).Value + "</scriptExtend>";
                        this.form1.InnerHtml += "</exten>";
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void getFuncExtend()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["funcExtend"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("getFuncExtend", new string[] { id.ToString() });
                    if (lis.Count > 0)
                    {
                        for (i = 0; i < lis.Count; i++)
                        {
                            this.form1.InnerHtml += "<funcExten>";
                            this.form1.InnerHtml += "<idFunc>" + lis[i].ElementAt(0).Value + "</idFunc>";
                            this.form1.InnerHtml += "<nameFunc>" + lis[i].ElementAt(1).Value + "</nameFunc>";
                            this.form1.InnerHtml += "<valueFunc>" + lis[i].ElementAt(2).Value + "</valueFunc>";
                            this.form1.InnerHtml += "</funcExten>";
                        }
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void saveFuncExtend()
        {
            try
            {
                bagClass b = new bagClass();
                string nameFunc = Request.Params["nameFunc"];
                string valueFunc = Request.Params["valueFunc"];
                int i = 0;
                int id = Int32.TryParse(Request.Params["idFunc"], out i) ? i : 0;
                i = 0;
                int idExtend = Int32.TryParse(Request.Params["idExtendFunc"], out i) ? i : 0;
                if (nameFunc != "" && valueFunc != "" && idExtend != 0)
                {                    
                    if (id == 0)
                        b.connect("insertFuncExtend", new string[] { idExtend.ToString(), nameFunc, valueFunc });
                    else
                        b.connect("updateFuncExtend", new string[] { id.ToString(), nameFunc, valueFunc }); 
                }
            }
            catch (Exception ex)
            {
                this.form1.InnerHtml = "<error>" + ex.Message + "</error>";
            }
        }
    }
}
