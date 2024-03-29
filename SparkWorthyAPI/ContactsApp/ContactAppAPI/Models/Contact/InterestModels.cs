﻿using ContactAppAPI.CommonUpdates;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ContactAppAPI.Models
{
    public class InterestModels
    {

        #region "Property"

        /// <summary>
        /// get or set the Id
        /// </summary>
        public int InterestedId { get; set; }

        /// <summary>
        /// get or set the Contact Id
        /// </summary>
        public int ContactId { get; set; }

        /// <summary>
        /// get or set the Interest Id
        /// </summary>
        public int InterestId { get; set; }

        /// <summary>
        /// get or set the Interest Name
        /// </summary>
        public string InterestName { get; set; }
                
        /// <summary>
        /// get or set the PictureLocation
        /// </summary>
        public string PictureLocation { get; set; }

        /// <summary>
        /// get or set the PictureDescription
        /// </summary>
        public string PictureDescription { get; set; }

        /// <summary>
        /// get or set the TempId
        /// </summary>
        public int TempId { get; set; }

        /// <summary>
        /// get or set the TempGetType
        /// </summary>
        public int TempGetType { get; set; }

        /// <summary>
        /// get or set the InterestIcons
        /// </summary>
        public string InterestIcons { get; set; }

        /// <summary>
        /// get or set the InterestListId
        /// </summary>
        public string InterestListId { get; set; }


        #endregion

        #region "Public Methods"

        /// <summary>
        /// Save interest on contact
        /// </summary>
        /// <returns></returns>
        public bool SaveInterest()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_insert_interest");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@InterestName", this.InterestName.ToString().Trim());
            DBOperations dbOperation = new DBOperations();
            string outputValue = string.Empty;
            bool Status = dbOperation.SaveData(sqlCommand, out outputValue, "");
            if (Status)
                return true;
            else
                return false;
        }

        // Stored Procedure for SAVE INTEREST
        /*
         *  --=================================
            -- Insert/Update the interest
            --=================================
            CREATE PROCEDURE usp_insert_interest
            (
            @InterestName varchar(100)
            )
            AS
            BEGIN
	            INSERT INTO Interest(InterestName) VALUES(@InterestName)
            END
         */


        /// <summary>
        /// Delete interest on contact
        /// </summary>
        /// <returns></returns>
        public bool DeleteInterest()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_delete_interest");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@InterestedId", this.InterestedId.ToString().Trim());
            DBOperations dbOperation = new DBOperations();
            bool Status = dbOperation.DeleteData(sqlCommand);
            if (Status)
                return true;
            else
                return false;
        }

        // Stored Procedure for DELETE INTEREST
        /*
         * --=================================
            -- Delete the interested on
            --=================================
            CREATE PROCEDURE usp_delete_interest
            (
            @InterestedId int
            )
            AS
            BEGIN
            IF(EXISTS(SELECT Id FROM Interest WHERE Id = @InterestedId))
	            BEGIN
		            DELETE FROM Interest WHERE Id = @InterestedId
	            END
            END             
         */

        /// <summary>
        /// Delete interest on contact
        /// </summary>
        /// <returns></returns>
        public bool DeleteContactInterest(int Id)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_delete_contact_interest");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@Id", Id);
            DBOperations dbOperation = new DBOperations();
            bool Status = dbOperation.DeleteData(sqlCommand);
            if (Status)
                return true;
            else
                return false;
        }

        /// <summary>
        /// insert group
        /// </summary>
        /// <returns></returns>
        public string ImportContactInterest()
        {
            try
            {
                SqlCommand sqlcommand = new SqlCommand("usp_insert_contact_interest_list");
                sqlcommand.CommandType = CommandType.StoredProcedure;
                sqlcommand.Parameters.AddWithValue("@ContactId", this.ContactId.ToString().Trim());
                sqlcommand.Parameters.AddWithValue("@InterestListId", this.InterestName.ToString().Trim());
                sqlcommand.Parameters.Add("@IdOut", SqlDbType.Int).Direction = ParameterDirection.Output;
                DBOperations dbOperation = new DBOperations();
                string outputValue = string.Empty;
                bool Status = dbOperation.SaveData(sqlcommand, out outputValue, "@IdOut");
                if (Status)
                    return outputValue.ToString().Trim();
                else
                    return "false";
            }
            catch(Exception ex)
            {
                return ex.ToString().Trim();
            }
        }


        #endregion

        #region "Private Methods"

        /// <summary>
        /// Get contact list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable GetInterestList()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_interest_list");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@Id", this.TempId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Type", this.TempGetType.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }


        /// <summary>
        /// Get contact list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable ViewSpecificInterestPictures()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_interest_profiles");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@interestId", this.InterestId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        #endregion

    }
}