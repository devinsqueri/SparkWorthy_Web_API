﻿using ContactAppAPI.Models;
using ContactAppAPI.Models.Contact;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ContactAppAPI.Controllers.Contact
{
    [RoutePrefix("api/innercircle")]
    public class InnerCircleController : ApiController
    {

        #region "Get InnerCircleList"

        /// <summary>
        /// Get interest list
        /// </summary>
        /// <param name="UserId">User Id</param>
        /// <param name="ContactId">Contact Id</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("GetInnerCircleList")]
        public HttpResponseMessage GetInnerCircleList(int ContactId)
        {
            InnerCircleModels innerCircleModels = new InnerCircleModels();
            List<InnerCircleModels> innerCircleModelsList = new List<InnerCircleModels>();
            innerCircleModels.ContactId = ContactId;
            innerCircleModelsList = this.GetInnerCircleListList(innerCircleModels);
            return Request.CreateResponse(HttpStatusCode.OK, innerCircleModelsList);
        }


        [HttpPost]
        public List<InnerCircleModels> GetInnerCircleListList(InnerCircleModels contactModels)
        {
            List<InnerCircleModels> innerCircleModelsList = new List<InnerCircleModels>();
            if (!string.IsNullOrEmpty(Convert.ToString(contactModels.ContactId)) && (contactModels.ContactId != 0))
            {
                DataTable dtContactList = new DataTable();
                dtContactList = contactModels.GetInnerCircleList();
                if (dtContactList.Rows.Count > 0)
                {
                    foreach (DataRow drInnerRow in dtContactList.Rows)
                    {
                        InnerCircleModels innerCircleModelsTypes = new InnerCircleModels();
                        innerCircleModelsTypes.ContactId = Convert.ToInt32(drInnerRow[0]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[1])))
                            innerCircleModelsTypes.InnerCircleId = Convert.ToInt32(drInnerRow[1]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[2])))
                            innerCircleModelsTypes.FirstName = Convert.ToString(drInnerRow[2]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[3])))
                            innerCircleModelsTypes.LastName = Convert.ToString(drInnerRow[3]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[4])))
                            innerCircleModelsTypes.ProfilePicture = Convert.ToString(drInnerRow[4]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[5])))
                            innerCircleModelsTypes.Profession = Convert.ToString(drInnerRow[5]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[6])))
                            innerCircleModelsTypes.RelationShip = Convert.ToString(drInnerRow[6]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[7])))
                            innerCircleModelsTypes.Notes = Convert.ToString(drInnerRow[7]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[8])))
                            innerCircleModelsTypes.Birthday = Convert.ToDateTime(drInnerRow[8]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInnerRow[9])))
                            innerCircleModelsTypes.Annivesary = Convert.ToDateTime(drInnerRow[9]);

                        innerCircleModelsList.Add(innerCircleModelsTypes);
                    }
                }
            }
            return innerCircleModelsList;
        }

        #endregion

        #region "Edit View"

        /// <summary>
        /// Get interest list
        /// </summary>
        /// <param name="UserId">User Id</param>
        /// <param name="ContactId">Contact Id</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("editView")]
        public HttpResponseMessage EditViewContact(int ContactId)
        {
            List<ContactModels> ContactModelsList = new List<ContactModels>();
            ContactModelsList = this.GetEditViewContactDetails(ContactId);
            return Request.CreateResponse(HttpStatusCode.OK, ContactModelsList);
        }

        [HttpPost]
        public List<ContactModels> GetEditViewContactDetails(int ContactId)
        {
            List<ContactModels> innerCircleModelsList = new List<ContactModels>();
            {
                InnerCircleModels innerCircleModels = new InnerCircleModels();
                DataTable dtContactList = new DataTable();
                dtContactList = innerCircleModels.GetEditViewInnerCircleList(ContactId);
                if (dtContactList.Rows.Count > 0)
                {
                    foreach (DataRow drEditInnerCircleRow in dtContactList.Rows)
                    {
                        ContactModels contactModelsTypes = new ContactModels();

                        contactModelsTypes.ContactId = Convert.ToInt32(drEditInnerCircleRow[0]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[1])))
                            contactModelsTypes.FirstName = Convert.ToString(drEditInnerCircleRow[1]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[2])))
                            contactModelsTypes.LastName = Convert.ToString(drEditInnerCircleRow[2]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[3])))
                            contactModelsTypes.RelationShip = Convert.ToString(drEditInnerCircleRow[3]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[4])))
                            contactModelsTypes.Profession = Convert.ToString(drEditInnerCircleRow[4]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[5])))
                            contactModelsTypes.BirthdayOn = Convert.ToDateTime(drEditInnerCircleRow[5]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[6])))
                            contactModelsTypes.Annivasary = Convert.ToDateTime(drEditInnerCircleRow[6]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[7])))
                            contactModelsTypes.Notes = Convert.ToString(drEditInnerCircleRow[7]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[8])))
                            contactModelsTypes.InterestList = Convert.ToString(drEditInnerCircleRow[8]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drEditInnerCircleRow[9])))
                            contactModelsTypes.ProfilePicture = ConfigurationManager.AppSettings["ContactProfile"].ToString().Trim() + Convert.ToString(drEditInnerCircleRow[9]);

                        innerCircleModelsList.Add(contactModelsTypes);
                    }
                }
            }

            return innerCircleModelsList;
        }


        #endregion

        #region "Add New Inner Circle"

        /// <summary>
        /// Add new interest
        /// </summary>
        /// <param name="InnerCircleModels">Inner Circle Models objects</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("saveContact")]
        public IHttpActionResult SaveNewContact(int InnerCircleId, int ContactId, string FName, string LName, string Profession, string Relation,
            string Notes, string DOB, string Annivasary)
        {
            InnerCircleModels innerCircleModels = new InnerCircleModels();
            ContactModels contactModels = new ContactModels();
            innerCircleModels.InnerCircleId = InnerCircleId;
            innerCircleModels.ContactId = ContactId;
            contactModels.FirstName = FName;
            if (!string.IsNullOrEmpty(Convert.ToString(LName))) contactModels.LastName = LName; else contactModels.LastName = string.Empty;
            if (!string.IsNullOrEmpty(Convert.ToString(Profession))) contactModels.Profession = Profession; else contactModels.Profession = string.Empty;
            if (!string.IsNullOrEmpty(Convert.ToString(Relation))) contactModels.RelationShip = Relation; else contactModels.RelationShip = string.Empty;
            if (!string.IsNullOrEmpty(Convert.ToString(Notes))) contactModels.Notes = Notes; else contactModels.Notes = string.Empty;
            if (!string.IsNullOrEmpty(DOB) && !DOB.Equals("null")) contactModels.BirthdayOn = Convert.ToDateTime(DOB); else contactModels.BirthdayOn = null;
            if (!string.IsNullOrEmpty(Annivasary) && !Annivasary.Equals("null")) contactModels.Annivasary = Convert.ToDateTime(Annivasary); else contactModels.Annivasary = null;
            string Status = string.Empty;
            Status = innerCircleModels.SaveInnerCircle(innerCircleModels, contactModels);
            return Ok(Status);
        }

        #endregion

        #region "Add Existing Inner Circle"

        /// <summary>
        /// Add new interest
        /// </summary>
        /// <param name = "InnerCircleModels" > Inner Circle Models objects</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("saveExistingContact")]
        public IHttpActionResult ExistingContact(int ParentContactId, int ChildContactId)
        {
            string Status = string.Empty;
            InnerCircleModels innerCircleModels = new InnerCircleModels();
            ContactModels contactModels = new ContactModels();
            innerCircleModels.ContactId = ParentContactId;
            //innerCircleModels.RelationshipContactId = ChildContactId;
            Status = innerCircleModels.SaveExistingInnerCircle(innerCircleModels, contactModels);
            return Ok(Status);
        }

        #endregion

        #region "Delete Interest"
        /// <summary>
        /// Delete interest
        /// </summary>
        /// <param name="UserId">UserId</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("delete")]
        public IHttpActionResult DeleteInnerCircle(int InnerCircleId)
        {
            bool Status = false;
            InnerCircleModels innerCircleModels = new InnerCircleModels();
            Status = innerCircleModels.DeleteInnerCircle(InnerCircleId);
            return Ok(Status);
        }

        #endregion

        #region "Update Inner Circle"

        /// <summary>
        /// Save new contact
        /// </summary>
        /// <param name="contactModels"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("update")]
        public HttpResponseMessage UpdateInnerCircle(int ContactId, string Relation, string Profession, string InterestListId, DateTime DOB, DateTime Annivasary, string Notes)
        {
            ContactModels contactModels = new ContactModels();
            contactModels.ContactId = ContactId;
            contactModels.RelationShip = Relation;
            contactModels.Profession = Profession;
            contactModels.InterestList = InterestListId;
            contactModels.BirthdayOn = DOB;
            contactModels.Annivasary = Annivasary;
            contactModels.Notes = Notes;
            string Status = string.Empty;
            if (!string.IsNullOrEmpty(Convert.ToString(contactModels.ContactId)))
                Status = contactModels.UpdateCircle();
            return Request.CreateResponse(HttpStatusCode.OK, Status);
        }

        #endregion

    }
}