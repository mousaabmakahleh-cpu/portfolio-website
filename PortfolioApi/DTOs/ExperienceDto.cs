using System.ComponentModel.DataAnnotations;
using PortfolioApi.DTOs.Validation;
using PortfolioApi.Models;

namespace PortfolioApi.DTOs
{
    public class ExperienceDto
    {
        [Required, StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required, StringLength(150)]
        public string Organization { get; set; } = string.Empty;

        [Required, RegularExpression(ExperienceTypes.Pattern, ErrorMessage = "Type must be Job, Internship, Course, Training or Volunteer.")]
        public string Type { get; set; } = ExperienceTypes.Course;

        [StringLength(100)]
        public string? Location { get; set; }

        [Required]
        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringList(20, 300)]
        public List<string> Highlights { get; set; } = new();

        [StringList(40, 60)]
        public List<string> Skills { get; set; } = new();

        [Range(0, 1000)]
        public int SortOrder { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
