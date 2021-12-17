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
    public partial class photo : System.Web.UI.Page
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
                if (Request.Params["newPhoto"] != null)
                    saveNewPhoto();
                if (Request.Params["deleteIdImg"] != null && Request.Params["boolFile"] != null)
                    deleteImg();
                if (Request.Params["deleteIdPhoto"] != null && Request.Params["boolFile"] != null)
                    deletePhoto();
                if (Request.Params["getInfoPhoto"] != null)
                    getInfoPhoto();
                if (Request.Params["getInfoImg"] != null)
                    getInfoImg();
                if (Request.Params["textEditImg"] != null && Request.Params["idImg"] != null)
                    saveInfoImg();
                if (Request.Params["array_file"] != null && Request.Params["idPhoto"] != null)
                    save_new_img();                
            }

            viewBase();
        }

        void viewBase()
        {
            bagClass b = new bagClass();
            try
            {
                string idPage = "0";
                string maxView = "5"; //максимальное число отображаемых элементов    
                if (Request.QueryString["page"] != null)
                {
                    int id = 0;
                    idPage = Int32.TryParse(Request.QueryString["page"], out id) ? id.ToString() : "0";
                }
                var lis = b.connect("selectPhoto", new string[] { idPage, maxView });
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
                        span.Attributes.Add("onclick", "bagphoto.addPhoto('" + lis[i].ElementAt(0).Value + "')");
                        strong.Controls.Add(span);

                        span = new HtmlGenericControl("span");
                        span.InnerText = "Добавить";
                        span.Attributes.Add("onclick", "bagphoto.NewUserImg('" + lis[i].ElementAt(0).Value + "')");
                        strong.Controls.Add(span);

                        span = new HtmlGenericControl("span");
                        span.InnerText = "Удалить";
                        span.Attributes.Add("onclick", "bagphoto.deletePhoto('" + lis[i].ElementAt(0).Value + "')");
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
                    lis = b.connect("selectPhotoCount", new string[] { });
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

        HtmlGenericControl getImages(string idPhoto)
        {
            bagClass b = new bagClass();
            HtmlGenericControl parentDiv = new HtmlGenericControl("div");
            var lis = b.connect("selectPhotoImg", new string[] { idPhoto });
            if (lis.Count > 0)
            {
                HtmlGenericControl div = new HtmlGenericControl("div");
                HtmlGenericControl span = new HtmlGenericControl("span");
                HtmlGenericControl img = new HtmlGenericControl("img");

                for (int i = 0; i < lis.Count; i++)
                {
                    div = new HtmlGenericControl("div");

                    img = new HtmlGenericControl("img");
                    img.Attributes.Add("src", lis[i].ElementAt(3).Value);
                    img.Attributes.Add("alt", lis[i].ElementAt(4).Value);
                    img.Attributes.Add("onclick", "baggeneral.viewBigImg(this)");
                    div.Controls.Add(img);

                    span = new HtmlGenericControl("span");
                    span.InnerText = "Редактировать";
                    span.Attributes.Add("onclick", "bagphoto.editPhotoImg('" + lis[i].ElementAt(0).Value + "')");
                    div.Controls.Add(span);                    

                    span = new HtmlGenericControl("span");
                    span.InnerText = "Удалить";
                    span.Attributes.Add("onclick", "bagphoto.deleteImg('" + lis[i].ElementAt(0).Value + "')");
                    div.Controls.Add(span);                   

                    parentDiv.Controls.Add(div);
                }  
            } 
            return parentDiv;
        }

        void saveNewPhoto()
        {
            try
            {
                string newPhoto = Request.Params["newPhoto"] != null ? Request.Params["newPhoto"] : "";
                string textPhoto = Request.Params["textPhoto"] != null ? Request.Params["textPhoto"] : "";
                int i = -1;
                int id = Int32.TryParse(Request.Params["idPhoto"], out i) ? i : -1;               
                bagClass b = new bagClass();
                if (newPhoto != "")
                    b.connect("saveNewPhoto", new string[] { id.ToString(), newPhoto, textPhoto });               

            }
            catch (Exception ex)
            {
                this.form1.InnerHtml = "<error>" + ex.Message + "</error>";
            }
        }

        void getInfoPhoto()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["getInfoPhoto"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("getInfoPhoto", new string[] { id.ToString() });
                    if (lis.Count > 0)
                    {
                        this.form1.InnerHtml += "<photo>";
                        this.form1.InnerHtml += "<namePhoto>" + lis[0].ElementAt(1).Value + "</namePhoto>";
                        this.form1.InnerHtml += "<textPhoto>" + lis[0].ElementAt(2).Value + "</textPhoto>";
                        this.form1.InnerHtml += "</photo>";
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void getInfoImg()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["getInfoImg"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("getInfoImg", new string[] { id.ToString() });
                    if (lis.Count > 0)
                    {
                        this.form1.InnerHtml += "<textImg>";
                        this.form1.InnerHtml += "<text>" + lis[0].ElementAt(4).Value + "</text>";
                        this.form1.InnerHtml += "</textImg>";
                    }
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void deleteImg()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["deleteIdImg"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("deleteImg", new string[] { id.ToString() });

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

        void deletePhoto()
        {
            try
            {
                this.form1.InnerHtml = "";
                int i = 0;
                int id = Int32.TryParse(Request.Params["deleteIdPhoto"], out i) ? i : 0;
                if (id != 0)
                {
                    bagClass b = new bagClass();
                    var lis = b.connect("deletePhoto", new string[] { id.ToString() });

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

        void saveInfoImg()
        {
            try
            {
                bagClass b = new bagClass();
                string text = Request.Params["textEditImg"];
                int id = 0;
                int idImg = Int32.TryParse(Request.Params["idImg"], out id) ? id : 0;
                if (idImg != 0)
                {
                    b.connect("updateInfoImg", new string[] { idImg.ToString(), text });
                }
            }
            catch (Exception er)
            {
                this.form1.InnerHtml = "<error>" + er.Message + "</error>";
            }
        }

        void save_new_img()
        {
            try
            {
                bagClass b = new bagClass();
                string[] file_name = Request.Params["array_file"].Split(';');
                int id = 0;
                int idPhoto = Int32.TryParse(Request.Params["idPhoto"], out id) ? id : 0;
                if (idPhoto != 0)
                {
                    if (file_name.Length > 0)
                    {
                        for (int i = 0; i < file_name.Length; i++)
                        {
                            if (File.Exists(Server.MapPath("/temp_file/" + file_name[i])) && File.Exists(Server.MapPath("/temp_file/s" + file_name[i])))
                            {
                                File.Move(Server.MapPath("/temp_file/" + file_name[i]), Server.MapPath("/user_images/" + file_name[i]));
                                File.Move(Server.MapPath("/temp_file/s" + file_name[i]), Server.MapPath("/user_images/s" + file_name[i]));
                                b.connect("saveNewImg", new string[] { idPhoto.ToString(), "/user_images/" + file_name[i], "/user_images/s" + file_name[i] });
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
    }
}
