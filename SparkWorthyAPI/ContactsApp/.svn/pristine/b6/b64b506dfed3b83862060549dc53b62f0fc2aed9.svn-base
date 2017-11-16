using ContactAppAPI.Models;
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
    [RoutePrefix("api/interest")]
    public class InterestController : ApiController
    {

        #region "Get Interest List" 

        /// <summary>
        /// Get interest list
        /// </summary>
        /// <param name="UserId">User Id</param>
        /// <param name="ContactId">Contact Id</param>
        /// <returns></returns>
        [HttpGet]
        [Route("getInterest")]
        [AllowAnonymous]
        public HttpResponseMessage GetInterestList(int GetType, int Id)
        {
            InterestModels interestModels = new InterestModels();
            List<InterestModels> interestModelList = new List<InterestModels>();
            interestModels.TempGetType = GetType;
            interestModels.TempId = Id;
            interestModelList = this.GetInterestDetails(interestModels);
            return Request.CreateResponse(HttpStatusCode.OK, interestModelList);
        }

        public List<InterestModels> GetInterestDetails(InterestModels interestModels)
        {
            List<InterestModels> interestModelsList = new List<InterestModels>();
            if (!string.IsNullOrEmpty(Convert.ToString(interestModels.TempGetType)))
            {
                DataTable dtGetUsers = new DataTable();
                dtGetUsers = interestModels.GetInterestList();
                if (dtGetUsers.Rows.Count > 0)
                {
                    int count = 0;
                    foreach (DataRow drInterestRow in dtGetUsers.Rows)
                    {
                        InterestModels InterestTypes = new InterestModels();

                        InterestTypes.InterestedId = Convert.ToInt32(drInterestRow.Table.Rows[count]["Id"]);

                        InterestTypes.InterestId = Convert.ToInt32(drInterestRow.Table.Rows[count]["InterestId"]);

                        InterestTypes.InterestName = Convert.ToString(drInterestRow.Table.Rows[count]["InterestName"]);

                        if (!string.IsNullOrEmpty(Convert.ToString(drInterestRow.Table.Rows[count]["Icons"])))
                            InterestTypes.PictureLocation = ConfigurationManager.AppSettings["InterestIconPath"].ToString().Trim() + Convert.ToString(drInterestRow.Table.Rows[count]["Icons"]);

                        interestModelsList.Add(InterestTypes);
                        count++;
                    }
                }
            }
            return interestModelsList;
        }


        /// <summary>
        /// Get interest profiles
        /// </summary>
        /// <param name="UserId">User Id</param>
        /// <param name="ContactId">Contact Id</param>
        /// <returns></returns>
        [HttpGet]
        [Route("viewInterestProfiles")]
        [AllowAnonymous]
        public HttpResponseMessage ViewInterestProfiles(int InterestId)
        {
            InterestModels interestModels = new InterestModels();
            List<InterestModels> interestModelList = new List<InterestModels>();
            interestModels.InterestId = InterestId;
            interestModelList = this.viewInterestSummary(interestModels);
            return Request.CreateResponse(HttpStatusCode.OK, interestModelList);
        }

        public List<InterestModels> viewInterestSummary(InterestModels interestModels)
        {
            List<InterestModels> interestModelsList = new List<InterestModels>();
            if (!string.IsNullOrEmpty(Convert.ToString(interestModels.ContactId)))
            {
                DataTable dtGetUsers = new DataTable();
                dtGetUsers = interestModels.ViewSpecificInterestPictures();
                if (dtGetUsers.Rows.Count > 0)
                {
                    foreach (DataRow drViewInterestRow in dtGetUsers.Rows)
                    {
                        InterestModels InterestTypes = new InterestModels();
                        InterestTypes.InterestedId = Convert.ToInt32(drViewInterestRow[0]);
                        InterestTypes.InterestId = Convert.ToInt32(drViewInterestRow[1]);
                        if (!string.IsNullOrEmpty(Convert.ToString(drViewInterestRow[2])))
                            InterestTypes.PictureLocation = Convert.ToString(drViewInterestRow[2]);
                        if (!string.IsNullOrEmpty(Convert.ToString(drViewInterestRow[3])))
                            InterestTypes.PictureDescription = Convert.ToString(drViewInterestRow[3]);
                        if (!string.IsNullOrEmpty(Convert.ToString(drViewInterestRow[4])))
                            InterestTypes.InterestName = Convert.ToString(drViewInterestRow[4]);
                        if (!string.IsNullOrEmpty(Convert.ToString(drViewInterestRow[5])))
                            InterestTypes.InterestIcons = Convert.ToString(drViewInterestRow[5]);
                        interestModelsList.Add(InterestTypes);
                    }
                }
            }
            return interestModelsList;
        }



        #endregion

        #region "Add New Interest" 

        /// <summary>
        /// Add new interest
        /// </summary>
        /// <param name="interestModels">interestModels objects</param>
        /// <returns></returns>
        [HttpGet]
        [Route("save")]
        [AllowAnonymous]
        public IHttpActionResult AddNewInterest(int ContactId, string InterestName)
        {
            InterestModels interestModels = new InterestModels();
            interestModels.ContactId = ContactId;
            interestModels.InterestName = InterestName;
            string Status = string.Empty;
            Status = interestModels.ImportContactInterest();
            return Ok(Status);
        }

        #endregion

        #region "Delete Interest" 

        /// <summary>
        /// Delete interest
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns></returns>
        [HttpGet]
        [Route("delete")]
        public IHttpActionResult DeleteInterest(int Id)
        {
            bool Status = false;
            InterestModels interestModels = new InterestModels();
            interestModels.InterestedId = Id;
            Status = interestModels.DeleteInterest();
            return Ok(Status);
        }

        #endregion

        #region "Add interest to contact"

        [HttpGet]
        [Route("AddContactInterest")]
        [AllowAnonymous]
        public IHttpActionResult AddContactinterest(int ContactId, string InterestListId)
        {
            InterestModels interestModels = new InterestModels();
            interestModels.ContactId = ContactId;
            interestModels.InterestListId = InterestListId;
            string Status = string.Empty;
            Status = interestModels.ImportContactInterest();
            return Ok(Status);
        }

        #endregion

        #region "Delete contact interest"

        /// <summary>
        /// Delete interest
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns></returns>
        [HttpGet]
        [Route("deleteContactInterest")]
        public IHttpActionResult DeleteCntactInterest(int Id)
        {
            bool Status = false;
            InterestModels interestModels = new InterestModels();
            Status = interestModels.DeleteContactInterest(Id);
            return Ok(Status);
        }

        #endregion

    }
}
