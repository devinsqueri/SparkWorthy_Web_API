using ContactApp.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;

namespace ContactApp.Controllers
{
    public class LoginController : Controller
    {
        string apiUrl = "http://localhost:4562/";

        [HttpGet]
        // GET: Login
        public ActionResult Index()
        {
            ViewBag.UserTypeList = GetUserType();
            return View();
        }

        private List<UserType> GetUserType()
        {
            List<UserType> userTypeList = new List<UserType>();
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(apiUrl);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = client.GetAsync("/Login/GetUserTypes").Result;
            if (response.IsSuccessStatusCode)
            {
                userTypeList = JsonConvert.DeserializeObject<List<UserType>>(response.Content.ReadAsStringAsync().Result);
            }
            return userTypeList;
        }
    }
}