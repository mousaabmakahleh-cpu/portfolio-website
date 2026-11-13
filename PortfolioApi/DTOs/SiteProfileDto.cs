using System.ComponentModel.DataAnnotations;
using PortfolioApi.DTOs.Validation;

namespace PortfolioApi.DTOs
{
    public class SiteProfileDto
    {
        [EmailAddress, StringLength(150)]
        public string? Email { get; set; }

        [SafeUrl]
        public string? GitHubUrl { get; set; }

        [SafeUrl]
        public string? LinkedInUrl { get; set; }

        [SafeUrl]
        public string? CvUrl { get; set; }

        [StringLength(100)]
        public string? Location { get; set; }
    }
}
