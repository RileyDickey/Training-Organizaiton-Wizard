using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Flow.Models.Requests
{
    public class TrainingOrgCertAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int OrganizationId { get; set; }

        [Required]
        public List<string> BatchOrgCerts { get; set; }

    }
}
