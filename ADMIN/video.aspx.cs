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
    public partial class video : System.Web.UI.Page
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
                if (Request.Params["newVideo"] != null)
                    saveNewVideo();
                if (Request.Params["getInfoVideo"] != null)
                    getInfoVideo();
                if (Request.Params["urlVideoList"] != null && Request.Params["idVideo"] != null)
                    saveNewVideoList();
                if (Request.Files.Count > 0)
                    save_temp_video();
                if (Request.Params["deleteIdVideo"] != null && Request.Params["boolFile"] != null)
                    deleteVideo();
                if (Request.Params["deleteIdList"] != null && Request.Params["boolFile"] != null)
                    deleteList();
                if (Request.Params["getInfoList"] != null)
                    getInfoList();
                if (Request.Params["textEditList"] != null && Request.Params["idList"] != null)
                    saveInfolist();
                              
            }

            viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                string idPage = "0";
                string maxView = "2"; //максимальное число отображаемых элементов    
                if (Request.QueryString["page"] != null)
                {
                    int id = 0;
                    idPage = Int32.TryParse(Request.QueryString["page"], out id) ? id.ToString() : "0";
                }
                var lis = b.connect("selectVideo", new string[] { idPage, maxView });
                if (lis.Count > 0)
                {                   

                    HtmlGenericControl parentDiv = new HtmlGenericControl("div");
                    parentDiv.Attributes.Add("class", "adminViewDivListing");

                    HtmlGenericControl div = new HtmlGenericControl("div");
                    HtmlGenericControl span = new HtmlGenericControl("span");
                    HtmlGenericControl strong = new HtmlGenericControl("strong");
                    HtmlGenericControl p = new HtmlGenericControl("p");
                                       
                    for (int i = 0; i < lis.Count; i++)
                    {
                        div = new HtmlGenericControl("div");
                        strong = new HtmlGenericControl("strong");
                        strong.InnerText = lis[i].ElementAt(1).Value;

                        span = new HtmlGenericControl("span");
                        span.InnerText = "Редактировать";
                        span.Attributes.Add("onclick", "bagvideo.addVideo('" + lis[i].ElementAt(0).Value + "')");
                        strong.Controls.Add(span);

                        span = new HtmlGenericControl("span");
                        span.InnerText = "Добавить";
                        span.Attributes.Add("onclick", "bagvideo.addVideoList('" + lis[i].ElementAt(0).Value + "')");
                        strong.Controls.Add(span);

                        span = new HtmlGenericControl("span");
                        span.InnerText = "Удалить";
                        span.Attributes.Add("onclick", "bagvideo.deleteVideo('" + lis[i].ElementAt(0).Value + "')");
                        strong.Controls.Add(span);

                        div.Controls.Add(strong);

                        p = new HtmlGenericControl("p");
                        p.InnerText = lis[i].ElementAt(2).Value;
                        div.Controls.Add(p);

                        div.Controls.Add(getImages(lis[i].ElementAt(0).Value));

                        parentDiv.Controls.Add(div);
                    }
                    view_base.Controls.Add(parentDiv);

                    //страничная навигация
                    lis = b.connect("selectVideoCount", new string[] { });
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

        HtmlGenericControl getImages(string idVideo)
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
                    for (int i = 0; i < lis.Count; i++)
                    {
                        div = new HtmlGenericControl("div");

                        videoplayer = new HtmlGenericControl("div");
                        videoplayer.InnerHtml = "<embed src='http://s3.spruto.org/embed/player.swf' type='application/x-shockwave-flash' allowfullscreen='true' allowScriptAccess='always' flashvars='set_video1_url=" + lis[i].ElementAt(2).Value + "'/>  ";
                        div.Controls.Add(videoplayer);

                        p = new HtmlGenericControl("p");
                        p.InnerText = lis[i].ElementAt(3).Value;
                        div.Controls.Add(p);

                        span = new HtmlGenericControl("span");
                        span.InnerText = "Редактировать";
                        span.Attributes.Add("onclick", "bagvideo.editVideoList('" + lis[i].ElementAt(0).Value + "')");
                        div.Controls.Add(span);

                        span = new HtmlGenericControl("span");
                        span.InnerText = "Удалить";
                        span.Attributes.Add("onclick", "bagvideo.deleteList('" + lis[i].ElementAt(0).Value + "')");
                        div.Controls.Add(span);

                        parentDiv.Controls.Add(div);
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
            return parentDiv;
        }

        void saveNewVideo()
        {
            try
            {
                string newVideo = Request.Params["newVideo"] != null ? Request.Params["newVideo"] : "";
                string textVideo = Request.Params["textVideo"] != null ? Request.Params["textVideo"] : "";
                int i = -1;
                int id = Int32.TryParse(Request.Params["idVideo"], out i) ? i : -1;               
                bagClass b = new bagClass();
                if (newVideo != "")
                    b.connect("saveNewVideo", new string[] { id.ToString(), newVideo, textVideo });               

            }
            catch (Exception ex)
            {
                this.form1.InnerHtml = "<error>" + ex.Message + "</error>";
            }
        }

        void getInfoVideo()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["getInfoVideo"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("getInfoVideo", new string[] { id.ToString() });
                    if (lis.Count > 0)
                    {
                        this.form1.InnerHtml += "<video>";
                        this.form1.InnerHtml += "<nameVideo>" + lis[0].ElementAt(1).Value + "</nameVideo>";
                        this.form1.InnerHtml += "<textVideo>" + lis[0].ElementAt(2).Value + "</textVideo>";
                        this.form1.InnerHtml += "</video>";
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void getInfoList()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["getInfoList"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("getInfoVideoList", new string[] { id.ToString() });
                    if (lis.Count > 0)
                    {
                        this.form1.InnerHtml += "<textList>";
                        this.form1.InnerHtml += "<text>" + lis[0].ElementAt(3).Value + "</text>";
                        this.form1.InnerHtml += "</textList>";
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void deleteList()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["deleteIdList"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("deleteVideoList", new string[] { id.ToString() });

                    string boolFile = Request.Params["boolFile"];
                    if (boolFile == "true" && lis.Count > 0)
                    {
                        File.Delete(Server.MapPath(lis[0].ElementAt(2).Value));
                        File.Delete(Server.MapPath(lis[0].ElementAt(3).Value));
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void deleteVideo()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["deleteIdVideo"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("deleteVideoAll", new string[] { id.ToString() });

                    string boolFile = Request.Params["boolFile"];
                    if (boolFile == "true")
                    {

                        File.Delete(Server.MapPath(lis[0].ElementAt(2).Value));
                        File.Delete(Server.MapPath(lis[0].ElementAt(3).Value));

                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void saveInfolist()
        {
            try
            {
                bagClass b = new bagClass();
                string text = Request.Params["textEditList"];
                int id = 0;
                int idList = Int32.TryParse(Request.Params["idList"], out id) ? id : 0;
                if (idList != 0)
                {
                    b.connect("updateInfoVideoList", new string[] { idList.ToString(), text });
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void saveNewVideoList()
        {
            try
            {
                bagClass b = new bagClass();
                string urlVideo = Request.Params["urlVideoList"];
                string textVideo = Request.Params["textVideoList"] != null ? Request.Params["textVideoList"] : "";
                int id = 0;
                int idVideo = Int32.TryParse(Request.Params["idVideo"], out id) ? id : 0;
                if (idVideo != 0 && urlVideo != "")
                {
                    b.connect("saveNewVideoList", new string[] { idVideo.ToString(), urlVideo, textVideo });
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void save_temp_video()
        {
            try
            {
                string str_name = DateTime.Now.Ticks.ToString();
                string ext = Request.Files[0].FileName.Split('.')[Request.Files[0].FileName.Split('.').Length - 1];
                Request.Files[0].SaveAs(Server.MapPath("/userfile/" + str_name + "." + ext));
                this.form1.InnerHtml = "<file_user>/userfile/" + str_name + "." + ext + "</file_user>";
                
            }
            catch (Exception ex)
            {
                this.form1.InnerHtml = "<error>" + ex.Message + "</error>";
            }
        }
    }
}
