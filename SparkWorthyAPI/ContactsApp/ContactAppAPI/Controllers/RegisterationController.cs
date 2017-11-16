using ContactAppAPI.Models.Login;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ContactAppAPI.Controllers
{
   [RoutePrefix("api/Register")]
    public class RegisterationController : ApiController
    {

        #region "Create Account" 

        ///// <summary>
        ///// Add new account
        ///// </summary>
        ///// <param name="CreateAccount">Registration objects</param>
        ///// <returns></returns>      
        //[HttpPost]
        //public IHttpActionResult PostSaveRegistration(RegisterModules registerModules)
        //{
        //    bool Status = registerModules.SaveAccount();  
        //    return Ok(Status);
        //}


        /// <summary>
        /// Save new contact
        /// </summary>
        /// <param name="registerModules"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("SaveRegistration")]
        public IHttpActionResult PostRegistration(string Name, DateTime DOB,
            string PhNo, string Email, string Passwd, string Company, string CompanyURL,
            string Position, string Country, string City, string State, string Zip, string InterestList)
        {
            bool Status = false;
            RegisterModules registerModules = new RegisterModules();
            registerModules.Name = Name;
            registerModules.DateOfBirth = DOB;
            if(!string.IsNullOrEmpty(registerModules.PhoneNumber)) registerModules.PhoneNumber = PhNo; else registerModules.PhoneNumber = string.Empty;
            registerModules.Email = Email;
            registerModules.Password = Passwd;
            if (!string.IsNullOrEmpty(registerModules.Company)) registerModules.Company = Company; else registerModules.Company = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.CompanyFeedLink)) registerModules.CompanyFeedLink = CompanyURL; else registerModules.CompanyFeedLink = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.Position)) registerModules.Position = Position; else registerModules.Position = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.Country)) registerModules.Country = Country; else registerModules.Country = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.City)) registerModules.City = City; else registerModules.City = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.State)) registerModules.State = State; else registerModules.State = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.ZipCode)) registerModules.ZipCode = Zip; else registerModules.ZipCode = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.InterestList)) registerModules.InterestList = InterestList; else registerModules.InterestList = string.Empty;
            if (!string.IsNullOrEmpty(registerModules.Name))
                Status = registerModules.SaveAccount();
            return Ok(Status);
        }


        #endregion

        [Route("validateEmail")]
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage CheckEmailAddress(string Email)
        {
            RegisterModules registerModules = new RegisterModules();
            string error = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(Email))
                {
                    DataTable dtGetUsers = new DataTable();
                    dtGetUsers = registerModules.ValidateEmail(Email);
                    if (dtGetUsers.Rows.Count > 0)
                        error = "Email Already exist";
                    else
                        error = "Allow";
                }
            }
            catch (Exception ex)
            {
                error = "Email Already exist + error: " + ex.ToString().Trim();
            }
            return Request.CreateResponse(HttpStatusCode.OK, error);
        }

        


    }
}
