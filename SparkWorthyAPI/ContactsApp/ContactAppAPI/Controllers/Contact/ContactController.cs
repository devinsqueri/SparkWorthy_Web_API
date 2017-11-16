﻿using ContactAppAPI.CommonUpdates;
using ContactAppAPI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;

namespace ContactAppAPI.Controllers
{
    [Authorize]
    [RoutePrefix("api/Contact")]
    public class ContactController : ApiController
    {

        #region "Save"

        /// <summary>
        /// Save new contact
        /// </summary>
        /// <param name="contactModels"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("Save")]
        public HttpResponseMessage PostRegistration(int ContactId, int UserId, string FirstName, string LastName, string EMail, string PhNo, string OfficeNo,
            string Position, string Company, string Relative, string Profilepic, string DOB, bool Fav, int FavRating, string Notes, string ModifyOn, string Profession,
            string AnnivasaryOn, string Location)
        {
            ContactModels contactModels = new ContactModels();

            contactModels.ContactId = ContactId;

            contactModels.UserId = UserId;

            contactModels.FirstName = FirstName;

            if (!string.IsNullOrEmpty(LastName)) contactModels.LastName = LastName; else contactModels.LastName = string.Empty;

            if (!string.IsNullOrEmpty(EMail)) contactModels.Email = EMail; else contactModels.Email = string.Empty;

            if (!string.IsNullOrEmpty(PhNo)) contactModels.PhoneNumber = PhNo; else contactModels.PhoneNumber = string.Empty;

            if (!string.IsNullOrEmpty(OfficeNo)) contactModels.OfficeNumber = OfficeNo; else contactModels.OfficeNumber = string.Empty;

            if (!string.IsNullOrEmpty(Position)) contactModels.Position = Position; else contactModels.Position = string.Empty;

            if (!string.IsNullOrEmpty(Company)) contactModels.CompanyName = Company; else contactModels.CompanyName = string.Empty;

            if (!string.IsNullOrEmpty(Relative)) contactModels.RelationShip = Relative; else contactModels.RelationShip = string.Empty;

            if (!string.IsNullOrEmpty(Profilepic)) contactModels.ProfilePicture = Profilepic; else contactModels.ProfilePicture = string.Empty;

            if (!string.IsNullOrEmpty(Profession)) contactModels.Profession = Profession; else contactModels.Profession = string.Empty;

            if (!string.IsNullOrEmpty(DOB)) contactModels.BirthdayOn = Convert.ToDateTime(DOB); else contactModels.BirthdayOn = null;

            if (!string.IsNullOrEmpty(AnnivasaryOn) && !AnnivasaryOn.Equals("null")) contactModels.Annivasary = Convert.ToDateTime(AnnivasaryOn); else contactModels.Annivasary = null;

            contactModels.IsFavorite = Fav;

            contactModels.Rating = FavRating;

            if (!string.IsNullOrEmpty(Notes)) contactModels.Notes = Notes; else contactModels.Notes = string.Empty;

            if (!string.IsNullOrEmpty(ModifyOn) && !ModifyOn.Equals("null")) contactModels.ModifiedOn = Convert.ToDateTime(ModifyOn); else contactModels.ModifiedOn = null;

            if (!string.IsNullOrEmpty(Location)) contactModels.Location = Location; else contactModels.Location = string.Empty;

            string Status = string.Empty;


            if (!string.IsNullOrEmpty(contactModels.FirstName))
                Status = contactModels.SaveContact();

            return Request.CreateResponse(HttpStatusCode.OK, Status);
        }

        #endregion

        #region "Delete"

        [AllowAnonymous]
        [Route("delete")]
        [HttpGet]
        public IHttpActionResult DeletePersonalDetails(int ContactId)
        {
            ContactModels contactModels = new ContactModels();
            contactModels.ContactId = ContactId;
            bool Status = contactModels.Delete();
            return Ok(Status);

        }

        #endregion

        #region "Sync contacts to Orgview"

        [AllowAnonymous]
        [Route("SynchContactInfo")]
        [HttpGet]
        public IHttpActionResult SynchContactInfo(string EmailId, int UserId)
        {
            try
            {
                ContactModels contactModels = new ContactModels();
                bool Status = contactModels.SynchContactInfo(EmailId, UserId);
                return Ok(Status);
            }
            catch (Exception ex)
            {
                return Ok(false);
            }
        }

        #endregion

        #region "Get Contact"

        /// <summary>
        /// Get contact list
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("ViewContacts")]
        [HttpGet]
        public HttpResponseMessage ViewContacts(int UserId, int ContactId)
        {
            List<ContactModels> contactModelsList = new List<ContactModels>();
            ContactModels contactModels = new ContactModels();
            contactModels.UserId = UserId; contactModels.ContactId = ContactId;
            contactModelsList = this.GetContactList(contactModels);
            return Request.CreateResponse(HttpStatusCode.OK, contactModelsList);
        }

        [HttpPost]
        public List<ContactModels> GetContactList(ContactModels contactModels)
        {
            List<ContactModels> contactModelsList = new List<ContactModels>();
            if (!string.IsNullOrEmpty(Convert.ToString(contactModels.UserId)) && (contactModels.UserId != 0))
            {
                DataTable dtContactList = new DataTable();
                dtContactList = contactModels.GetContactDetails(contactModels);
                if (dtContactList.Rows.Count > 0)
                {
                    foreach (DataRow drContact in dtContactList.Rows)
                    {
                        ContactModels contactModelsTypes = new ContactModels();
                        contactModelsTypes.UserId = Convert.ToInt32(drContact[0]);

                        contactModelsTypes.ContactId = Convert.ToInt32(drContact[1]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[2])))
                            contactModelsTypes.FirstName = Convert.ToString(drContact[2]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[3])))
                            contactModelsTypes.LastName = Convert.ToString(drContact[3]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[4])))
                            contactModelsTypes.Email = Convert.ToString(drContact[4]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[5])))
                            contactModelsTypes.PhoneNumber = Convert.ToString(drContact[5]);

                        contactModelsTypes.OfficeNumber = Convert.ToString(drContact[6]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[7])))
                            contactModelsTypes.Position = Convert.ToString(drContact[7]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[8])))
                            contactModelsTypes.CompanyName = Convert.ToString(drContact[8]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[9])))
                            contactModelsTypes.RelationShip = Convert.ToString(drContact[9]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[10])))
                            contactModelsTypes.ProfilePicture = ConfigurationManager.AppSettings["ContactProfile"].ToString().Trim() + Convert.ToString(drContact[10]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[11])))
                            contactModelsTypes.BirthdayOn = Convert.ToDateTime(drContact[11]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[12])))
                            contactModelsTypes.IsFavorite = Convert.ToBoolean(drContact[12]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[13])))
                            contactModelsTypes.Rating = Convert.ToInt32(drContact[13]);

                        contactModelsTypes.CreatedOn = Convert.ToDateTime(drContact[14]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[15])))
                            contactModelsTypes.ModifiedOn = Convert.ToDateTime(drContact[15]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[16])))
                            contactModelsTypes.Profession = Convert.ToString(drContact[16]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[17])))
                            contactModelsTypes.Annivasary = Convert.ToDateTime(drContact[17]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[18])))
                            contactModelsTypes.Notes = Convert.ToString(drContact[18]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drContact[19])))
                            contactModelsTypes.Location = Convert.ToString(drContact[19]);

                        contactModelsList.Add(contactModelsTypes);
                    }
                }
            }
            return contactModelsList;
        }

        #endregion

        #region "Get Birthday Contact"

        /// <summary>
        /// Get birthday contact list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("todayBirthdays")]
        [HttpGet]
        public HttpResponseMessage GetBirthdayContacts(int UserId)
        {
            List<ContactModels> contactModelsList = new List<ContactModels>();
            contactModelsList = this.GetBirthdayContactList(UserId);
            return Request.CreateResponse(HttpStatusCode.OK, contactModelsList);
        }


        [HttpPost]
        public List<ContactModels> GetBirthdayContactList(int UserId)
        {
            ContactModels contactModels = new ContactModels();
            List<ContactModels> contactModelsList = new List<ContactModels>();
            if (!string.IsNullOrEmpty(Convert.ToString(contactModels.UserId)) && (contactModels.UserId != 0))
            {
                DataTable dtContactList = new DataTable();
                dtContactList = contactModels.GetBirthdayContactDetails(UserId);
                if (dtContactList.Rows.Count > 0)
                {
                    foreach (DataRow drBirthdayList in dtContactList.Rows)
                    {
                        ContactModels contactModelsTypes = new ContactModels();

                        contactModelsTypes.ContactId = Convert.ToInt32(drBirthdayList[0]);

                        contactModelsTypes.UserId = Convert.ToInt32(drBirthdayList[1]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[2])))
                            contactModelsTypes.FirstName = Convert.ToString(drBirthdayList[2]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[3])))
                            contactModelsTypes.LastName = Convert.ToString(drBirthdayList[3]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[4])))
                            contactModelsTypes.Email = Convert.ToString(drBirthdayList[4]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[5])))
                            contactModelsTypes.PhoneNumber = Convert.ToString(drBirthdayList[5]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[6])))
                            contactModelsTypes.OfficeNumber = Convert.ToString(drBirthdayList[6]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[7])))
                            contactModelsTypes.Position = Convert.ToString(drBirthdayList[7]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[8])))
                            contactModelsTypes.CompanyName = Convert.ToString(drBirthdayList[8]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[9])))
                            contactModelsTypes.RelationShip = Convert.ToString(drBirthdayList[9]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[10])))
                            contactModelsTypes.ProfilePicture = ConfigurationManager.AppSettings["ContactProfile"].ToString().Trim() + Convert.ToString(drBirthdayList[10]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[11])))
                            contactModelsTypes.Profession = Convert.ToString(drBirthdayList[11]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[12])))
                            contactModelsTypes.BirthdayOn = Convert.ToDateTime(drBirthdayList[12]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[13])))
                            contactModelsTypes.Annivasary = Convert.ToDateTime(drBirthdayList[13]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[14])))
                            contactModelsTypes.IsFavorite = Convert.ToBoolean(drBirthdayList[14]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[15])))
                            contactModelsTypes.Rating = Convert.ToInt32(drBirthdayList[15]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[16])))
                            contactModelsTypes.Notes = Convert.ToString(drBirthdayList[16]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[17])))
                            contactModelsTypes.CreatedOn = Convert.ToDateTime(drBirthdayList[17]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drBirthdayList[18])))
                            contactModelsTypes.ModifiedOn = Convert.ToDateTime(drBirthdayList[18]);

                        contactModelsList.Add(contactModelsTypes);
                    }
                }
            }
            return contactModelsList;
        }



        #endregion

        #region "upload profile picture"

        /// <summary>
        /// upload profile picture
        /// </summary>
        /// <param name="ContactModels"></param>
        /// <returns></returns>

        [AllowAnonymous]
        [HttpPost]
        [Route("uploadProfile")]
        public string UploadFiles(int TypeId, int UpdateId)
        {
            string FolderName = string.Empty;
            if (TypeId == 1)
                FolderName = "Users";
            else if (TypeId == 2)
                FolderName = "Contacts";
            else
                FolderName = "Groups";

            string sPath = "UploadImages/" + FolderName + "/";

            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                string filePath = string.Empty;
                string FileName = string.Empty;
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    filePath = HttpContext.Current.Server.MapPath("~/" + sPath + postedFile.FileName);
                    //filePath = ConfigurationManager.AppSettings["UploadProfile"] + sPath + postedFile.FileName;
                    FileName = postedFile.FileName;
                    postedFile.SaveAs(filePath);
                }

                // SAVE Record
                ContactModels contactModels = new ContactModels();
                contactModels.TypeId = TypeId;
                contactModels.ContactId = UpdateId;
                contactModels.ProfilePicture = FileName;
                contactModels.ProfileLocation = filePath;
                string Status = string.Empty;
                if (!string.IsNullOrEmpty(Convert.ToString(contactModels.ContactId)))
                    Status = contactModels.UploadProfilePicture();
                return Status;
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return result.ToString().Trim();
        }


        #endregion
    }
}
