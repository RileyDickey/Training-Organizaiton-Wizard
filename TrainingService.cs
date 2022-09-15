using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;


namespace Sabio.Services
{
    public class TrainingService : ITrainingService
    {
        private IDataProvider _dataProvider = null;
        private ILocationService _locationService = null;
        private ILookUpService _lookUpService = null;

        public TrainingService(IDataProvider dataProvider, ILocationService locationService, ILookUpService lookUpService)
        {
            _dataProvider = dataProvider;
            _locationService = locationService;
            _lookUpService = lookUpService;
        }

        public Paged<TrainingOrgCert> Search(int pageIndex, int pageSize, int certId)
        {
            Paged<TrainingOrgCert> pagedResult = null;

            List<TrainingOrgCert> result = null;

            int totalCount = 0;

            _dataProvider.ExecuteCmd(
                "dbo.TrainingOrgCertifications_SelectByTrainingType",
                delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@CertId", certId);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                TrainingOrgCert trainingOrgCert = MapTrainingOrgCert(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }


                if (result == null)
                {
                    result = new List<TrainingOrgCert>();
                }

                result.Add(trainingOrgCert);
            }
            );
            if (result != null)
            {
                pagedResult = new Paged<TrainingOrgCert>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;

        }

        public List<LookUp> GetAll()
        {
            List<LookUp> list = null;
            string procName = "[dbo].[CertificationTypes_SelectAll]";
            _dataProvider.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    LookUp referenceType = MapCert(reader);
                    if (list == null)
                    {
                        list = new List<LookUp>();
                    }
                    list.Add(referenceType);
                }
                );
            return list;
        }

        public int Add(TrainingOrgCertAddRequest model, int userId)
        {
            int id = 0;
            string procName = "dbo.TrainingOrgCertifications_BatchInsert";
            DataTable batchCerts = null;
            batchCerts = MapCertsToTable(model.BatchOrgCerts);


            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@OrganizationId", model.OrganizationId);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@batchOrgCerts", batchCerts);

            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object orgId = returnCol["@OrganizationId"].Value;
                int.TryParse(orgId.ToString(), out id);
            });
            return id;
        }

        private DataTable MapCertsToTable(List<string> certsToMap)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add("Name", typeof(string));

            if (certsToMap != null)
            {
                foreach (string singleCert in certsToMap)
                {
                    DataRow dr = dt.NewRow();
                    int startingIndex = 0;
                    dr.SetField(startingIndex, singleCert);
                    dt.Rows.Add(dr);
                }
            }
            return dt;
        }
        public LookUp MapCert(IDataReader reader)
        {
            int startingIndex = 0;
            LookUp referenceType;
            referenceType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            return referenceType;
        }

        public TrainingOrgCert MapTrainingOrgCert(IDataReader reader, ref int startingIndex)
        {
            TrainingOrgCert trainingOrgCert = new TrainingOrgCert();
            trainingOrgCert.Id = reader.GetSafeInt32(startingIndex++);
            trainingOrgCert.Name = reader.GetSafeString(startingIndex++);
            trainingOrgCert.CertificateId = reader.GetSafeInt32(startingIndex++);
            trainingOrgCert.CertificateName = reader.GetSafeString(startingIndex++);
            trainingOrgCert.Description = reader.GetSafeString(startingIndex++);
            trainingOrgCert.Logo = reader.GetSafeString(startingIndex++);
            trainingOrgCert.BusinessPhone = reader.GetSafeString(startingIndex++);
            trainingOrgCert.Location = _locationService.MapSingleLocation(reader, ref startingIndex);
            trainingOrgCert.SiteUrl = reader.GetSafeString(startingIndex++);

            return trainingOrgCert;
        }
    }
}
