using ContactAppAPI.CommonUpdates;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ContactAppAPI.Models.Contact
{
    public class InnerCircleModels
    {

        #region "Property"

        /// <summary>
        /// get or set the User Id
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// get or set the Contact Id
        /// </summary>
        public int ContactId { get; set; }

        /// <summary>
        /// get or set the Inner Circle Id
        /// </summary>
        public int InnerCircleId { get; set; }
        
        /// <summary>
        /// get or set the Inner Circle Relationship
        /// </summary>
        public string RelationShip { get; set; }

        /// <summary>
        /// get or set the Created On
        /// </summary>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// get or set the Annivesary
        /// </summary>
        public DateTime Annivesary { get; set; }

        /// <summary>
        /// get or set the Note
        /// </summary>
        public string Notes { get; set; }

        /// <summary>
        /// get or set the FirstName
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// get or set the LastName
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// get or set the ProfilePicture
        /// </summary>
        public string ProfilePicture { get; set; }

        /// <summary>
        /// get or set the RelativeOrFamily
        /// </summary>
        public string RelativeOrFamily { get; set; }

        /// <summary>
        /// get or set the Profession
        /// </summary>
        public string Profession { get; set; }

        /// <summary>
        /// get or set the Annivesary
        /// </summary>
        public DateTime Birthday { get; set; }

        #endregion

        #region "Public Methods"

        #region "Save new circle contact"

        /// <summary>
        /// Save Inner Circle
        /// </summary>
        /// <returns></returns>
        public string SaveInnerCircle(InnerCircleModels innerCircleModels, ContactModels contactModels)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_insert_innercircle");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@InnerCircleId", innerCircleModels.InnerCircleId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@ParentContactId", innerCircleModels.ContactId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@FirstName", contactModels.FirstName.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@LastName", contactModels.LastName.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Profession", contactModels.Profession.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@RelationShip", contactModels.RelationShip.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Note", contactModels.Notes.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Birthday", contactModels.BirthdayOn.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@Annivesary", contactModels.Annivasary.ToString().Trim());
            sqlCommand.Parameters.Add("@IdOut", SqlDbType.Int).Direction = ParameterDirection.Output;
            DBOperations dbOperation = new DBOperations();
            string outputValue = string.Empty;
            bool Status = dbOperation.SaveData(sqlCommand, out outputValue, "@IdOut");
            if (Status)
                return outputValue;
            else
                return "false";
        }

        #endregion

        #region "Save new circle contact"

        /// <summary>
        /// Save Inner Circle
        /// </summary>
        /// <returns></returns>
        public string SaveExistingInnerCircle(InnerCircleModels innerCircleModels, ContactModels contactModels)
        {
            SqlCommand sqlCommandParent = new SqlCommand("usp_insert_innercircle_master_contacts");
            sqlCommandParent.CommandType = CommandType.StoredProcedure;
            sqlCommandParent.Parameters.AddWithValue("@ContactId", Convert.ToInt32(innerCircleModels.ContactId));
            //sqlCommandParent.Parameters.AddWithValue("@RelationshipContactId", Convert.ToInt32(innerCircleModels.RelationshipContactId));
            sqlCommandParent.Parameters.Add("@IdOut", SqlDbType.Int).Direction = ParameterDirection.Output;
            DBOperations dbOperation = new DBOperations();
            string outputValue = string.Empty;
            bool Status = dbOperation.SaveData(sqlCommandParent, out outputValue, "@IdOut");
            if (Status)
                return outputValue;
            else
                return "false";
        }

        #endregion

        #region "Delete"

        /// <summary>
        /// Delete Inner Circles
        /// </summary>
        /// <returns></returns>
        public bool DeleteInnerCircle(int InnerCircleId)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_delete_innercircle");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@InnerCircleId", InnerCircleId.ToString().Trim());
            DBOperations dbOperation = new DBOperations();
            bool Status = dbOperation.DeleteData(sqlCommand);
            if (Status)
                return true;
            else
                return false;
        }

        #endregion

        #endregion

        #region "Private Methods"

        /// <summary>
        /// Get inner circle list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable GetInnerCircleList()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_innercircle_list");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@ContactId", this.ContactId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        /// <summary>
        /// Get edit view circle list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable GetEditViewInnerCircleList(int ContactId)
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_innercircle_edit_mode_list");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@ContactId", ContactId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        #endregion

    }
}