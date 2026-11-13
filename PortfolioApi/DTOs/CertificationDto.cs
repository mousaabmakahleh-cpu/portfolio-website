using System.ComponentModel.DataAnnotations;
using PortfolioApi.DTOs.Validation;

namespace PortfolioApi.DTOs
{
    public class CertificationDto
    {
        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required, StringLength(150)]
        public string Issuer { get; set; } = string.Empty;

        public DateOnly? StartDate { get; set; }
        public DateOnly? IssueDate { get; set; }

        [Range(0, 10000)]
        public int? Hours { get; set; }

        [SafeUrl]
        public string? ImageUrl { get; set; }

        [SafeUrl]
        public string? CredentialUrl { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringList(30, 200)]
        public List<string> LearnedTopics { get; set; } = new();

        [StringList(40, 60)]
        public List<string> Skills { get; set; } = new();

        [Range(0, 1000)]
        public int SortOrder { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
