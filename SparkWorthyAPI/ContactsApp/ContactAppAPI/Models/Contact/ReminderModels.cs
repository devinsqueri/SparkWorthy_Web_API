﻿using ContactAppAPI.CommonUpdates;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ContactAppAPI.Models.Contact
{
    public class ReminderModels
    {

        #region "Property"

        /// <summary>
        /// get or set the UserId
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// get or set the ContactId
        /// </summary>
        public int ContactId { get; set; }

        /// <summary>
        /// get or set the ReminderId
        /// </summary>
        public int ReminderId { get; set; }

        /// <summary>
        /// get or set the Command
        /// </summary>
        public string Command { get; set; }

        /// <summary>
        /// get or set the Notes
        /// </summary>
        public string Notes { get; set; }
        
        /// <summary>
        /// get or set the Active
        /// </summary>
        public bool ReminderON { get; set; }

        /// <summary>
        /// get or set the Short Date
        /// </summary>
        public string DateOnly { get; set; }

        /// <summary>
        /// get or set the Time Date
        /// </summary>
        public string TimeOnly { get; set; }

        #endregion

        #region "Public Methods"

        /// <summary>
        /// Save reminder on contact
        /// </summary>
        /// <returns></returns>
        public string SaveReminder()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_insert_reminder");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@ReminderId", this.ReminderId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@ContactId", this.ContactId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Command", this.Command.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Notes", this.Notes.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@ReminderTime", this.TimeOnly.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@ReminderDate", this.DateOnly.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@ReminderON", this.ReminderId.ToString().Trim());
            sqlCommand.Parameters.Add("@IdOut", SqlDbType.Int).Direction = ParameterDirection.Output;
            DBOperations dbOperation = new DBOperations();
            string outputValue = string.Empty;
            bool Status = dbOperation.SaveData(sqlCommand, out outputValue, "@IdOut");
            if (Status)
                return outputValue;
            else
                return "false";
        }

        /// <summary>
        /// Delete reminder on contact
        /// </summary>
        /// <returns></returns>
        public bool DeleteReminder()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_delete_reminder");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@ReminderId", this.ReminderId.ToString().Trim());
            DBOperations dbOperation = new DBOperations();
            bool Status = dbOperation.DeleteData(sqlCommand);
            if (Status)
                return true;
            else
                return false;
        }


        /// <summary>
        /// Active/Inactive Reminder reminder on contact
        /// </summary>
        /// <returns></returns>
        public bool ActiveDeActiveReminder()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_active_inactive_reminder");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@ReminderId", this.ReminderId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Active", this.ReminderON.ToString().Trim());
            DBOperations dbOperation = new DBOperations();
            bool Status = dbOperation.DeleteData(sqlCommand);
            if (Status)
                return true;
            else
                return false;
        }

        #endregion

        #region "Private Methods"

        /// <summary>
        /// Get reminder list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable GetReminderList()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_reminder_list");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@ContactId", this.ContactId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@ReminderId", this.ReminderId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        #endregion

    }
}