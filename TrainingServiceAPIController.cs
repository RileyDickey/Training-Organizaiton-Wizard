using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/trainingproviders")]
    [ApiController]
    public class TrainingServiceAPIController : BaseApiController
    {
        private ITrainingService _service = null;
        private IAuthenticationService<int> _authService = null;
        public TrainingServiceAPIController(ITrainingService service
            , ILogger<TrainingServiceAPIController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }



        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<TrainingOrgCert>>> Search(int pageIndex, int pageSize, int certId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<TrainingOrgCert> page = _service.Search(pageIndex, pageSize, certId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<TrainingOrgCert>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);

        }

        [HttpGet("certificateTypes")]
        public ActionResult<ItemsResponse<LookUp>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<LookUp> list = _service.GetAll();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<LookUp> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);
        }

        [HttpPost("certificateSelection")]
        //[AllowAnonymous]
        public ActionResult<ItemResponse<int>> Add(TrainingOrgCertAddRequest model)
        {
            int userId = _authService.GetCurrentUserId();
            ObjectResult result = null;

            try
            {
                int OrgId = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = OrgId };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }
    }
}

