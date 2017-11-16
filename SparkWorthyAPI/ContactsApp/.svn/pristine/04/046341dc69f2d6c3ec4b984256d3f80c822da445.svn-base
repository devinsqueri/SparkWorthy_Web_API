using ContactAppAPI.CommonUpdates;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ContactAppAPI.Models.GroupContact
{
    public class Group
    {

        #region "Property"

        /// <summary>
        /// get or set the User Id
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// get or set the Group Id
        /// </summary>
        public int GroupId { get; set; }

        /// <summary>
        /// get or set the Group Name
        /// </summary>
        public string GroupName { get; set; }

        /// <summary>
        /// get or set the Profile Picture
        /// </summary>
        public string ProfilePicture { get; set; }

        /// <summary>
        /// get or set the Created On
        /// </summary>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// get or set the Modified On
        /// </summary>
        public DateTime ModifiedOn { get; set; }

        #endregion

        #region "Public Methods"

        /// <summary>
        /// Save/Update group detail
        /// </summary>
        /// <returns></returns>
        public bool SaveGroup()
        {
            SqlCommand sqlcommand = new SqlCommand("usp_insert_group");
            sqlcommand.CommandType = CommandType.StoredProcedure;
            sqlcommand.Parameters.AddWithValue("@UserId", this.UserId.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@GroupId", this.GroupId.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@GroupName", this.GroupName.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@ProfilePicture", this.ProfilePicture.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@CreatedOn", this.CreatedOn.ToString().Trim());
            sqlcommand.Parameters.AddWithValue("@ModifiedOn", this.ModifiedOn.ToString().Trim());
            sqlcommand.Parameters.Add("@IdOut", SqlDbType.UniqueIdentifier).Direction = ParameterDirection.Input;
            DBOperations dbOperation = new DBOperations();
            string outputValue = string.Empty;
            bool Status = dbOperation.SaveData(sqlcommand, out outputValue, "@IdOut");
            if (Status)
                return true;
            else
                return false;
        }

        /// <summary>
        /// Delete group
        /// </summary>
        /// <returns></returns>
        public bool DeleteGroup()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_delete_group");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@UserId", this.UserId.ToString().Trim());
            sqlCommand.Parameters.AddWithValue("@GroupId", this.GroupId.ToString().Trim());
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
        /// Get group list
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        protected internal DataTable GetGroupList()
        {
            SqlCommand sqlCommand = new SqlCommand("usp_get_group_list");
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.Parameters.AddWithValue("@UserId", this.UserId.ToString().Trim());
            DBOperations dbOperations = new DBOperations();
            return dbOperations.GetTableData(sqlCommand);
        }

        #endregion
        
    }
}