using ContactAppAPI.Models.Contact;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ContactAppAPI.Controllers.Contact
{
    [RoutePrefix("api/Reminder")]
    public class ReminderController : ApiController
    {

        #region "Get reminder List" 

        /// <summary>
        /// Get reminder list
        /// </summary>
        /// <param name="UserId">User Id</param>
        /// <param name="ContactId">Contact Id</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("view")]
        public HttpResponseMessage ViewReminders(int ContactId, int ReminderId)
        {
            List<ReminderModels> reminderModelsList = new List<ReminderModels>();
            ReminderModels reminderModels = new ReminderModels();
            reminderModels.ContactId = ContactId; reminderModels.ReminderId = ReminderId;
            reminderModelsList = this.GetReminderListList(reminderModels);
            return Request.CreateResponse(HttpStatusCode.OK, reminderModelsList);
        }

        [HttpPost]
        public List<ReminderModels> GetReminderListList(ReminderModels reminderModels)
        {
            List<ReminderModels> reminderModelsList = new List<ReminderModels>();
            if (!string.IsNullOrEmpty(Convert.ToString(reminderModels.ContactId)) && (reminderModels.ContactId != 0))
            {
                DataTable dtContactList = new DataTable();
                dtContactList = reminderModels.GetReminderList();
                if (dtContactList.Rows.Count > 0)
                {
                    foreach (DataRow dr in dtContactList.Rows)
                    {
                        ReminderModels reminderModelsType = new ReminderModels();

                        reminderModelsType.ContactId = Convert.ToInt32(dr[0]);

                        reminderModelsType.ReminderId = Convert.ToInt32(dr[1]);

                        if (!string.IsNullOrEmpty(Convert.ToString(dr[2])))
                            reminderModelsType.Command = Convert.ToString(dr[2]);

                        if (!string.IsNullOrEmpty(Convert.ToString(dr[3])))
                            reminderModelsType.Notes = Convert.ToString(dr[3]);

                        if (!string.IsNullOrEmpty(Convert.ToString(dr[4])))
                            reminderModelsType.TimeOnly = Convert.ToString(dr[4]);

                        if (!string.IsNullOrEmpty(Convert.ToString(dr[5])))
                            reminderModelsType.DateOnly = Convert.ToString(dr[5]);

                        reminderModelsType.ReminderON = Convert.ToBoolean(dr[6]);

                        reminderModelsList.Add(reminderModelsType);
                    }
                }
            }
            return reminderModelsList;
        }


        #endregion

        #region "Add New Reminder" 

        /// <summary>
        /// Add new interest
        /// </summary>
        /// <param name="interestModels">interestModels objects</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("saveReminder")]
        public IHttpActionResult AddNewReminder(int ReminderId, int ContactId, string Command, string Notes, string SetTime, string SetDate, bool ReminderON)
        {
            ReminderModels reminderModels = new ReminderModels();
            reminderModels.ReminderId = ReminderId;
            reminderModels.ContactId = ContactId;
            reminderModels.Command = Command;
            if (!string.IsNullOrEmpty(Convert.ToString(Notes)))
                reminderModels.Notes = Notes;
            else
                reminderModels.Notes = string.Empty;
            reminderModels.TimeOnly = SetTime;
            reminderModels.DateOnly = SetDate;
            reminderModels.ReminderON = ReminderON;
            string Status = string.Empty;
            Status = reminderModels.SaveReminder();
            return Ok(Status);
        }

        #endregion

        #region "Delete Reminder" 

        /// <summary>
        /// Delete interest
        /// </summary>
        /// <param name="UserId">UserId</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("delete")]
        public IHttpActionResult DeleteReminder(int ReminderId)
        {
            bool Status = false;
            ReminderModels reminderModels = new ReminderModels();
            reminderModels.ReminderId = ReminderId;
            Status = reminderModels.DeleteReminder();
            return Ok(Status);
        }


        #endregion

        #region "Set Mode"

        /// <summary>
        /// Delete interest
        /// </summary>
        /// <param name="UserId">UserId</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [Route("enableAlarm")]
        public IHttpActionResult enableAlarm(int ReminderId, bool ModeType)
        {
            bool Status = false;
            ReminderModels reminderModels = new ReminderModels();
            reminderModels.ReminderId = ReminderId;
            reminderModels.ReminderON = ModeType;
            Status = reminderModels.ActiveDeActiveReminder();
            return Ok(Status);
        }


        #endregion  
    }
}
