using System.ComponentModel.DataAnnotations;
using PortfolioApi.DTOs.Validation;
using PortfolioApi.Models;

namespace PortfolioApi.DTOs
{
    public class CreateProjectDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(4000)]
        public string Description { get; set; } = string.Empty;

        [SafeUrl]
        public string? ImageUrl { get; set; }

        [SafeUrl]
        public string? ProjectUrl { get; set; }

        [SafeUrl]
        public string? FrontendRepoUrl { get; set; }

        [SafeUrl]
        public string? BackendRepoUrl { get; set; }

        [RegularExpression(ProjectStatuses.Pattern, ErrorMessage = "Status must be Completed, InProgress or Planned.")]
        public string Status { get; set; } = ProjectStatuses.Completed;

        [StringList(40, 300)]
        public List<string> Features { get; set; } = new();

        [StringList(30, 60)]
        public List<string> Technologies { get; set; } = new();

        [Range(0, 1000)]
        public int SortOrder { get; set; }
    }
}
