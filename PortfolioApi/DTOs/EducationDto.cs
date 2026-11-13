using System.ComponentModel.DataAnnotations;
using PortfolioApi.DTOs.Validation;

namespace PortfolioApi.DTOs
{
    public class EducationDto
    {
        [Required, StringLength(150)]
        public string Institution { get; set; } = string.Empty;

        [Required, StringLength(150)]
        public string Degree { get; set; } = string.Empty;

        [StringLength(150)]
        public string? FieldOfStudy { get; set; }

        [StringLength(100)]
        public string? Location { get; set; }

        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        [StringLength(30)]
        public string? Gpa { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringList(40, 100)]
        public List<string> Subjects { get; set; } = new();

        [Range(0, 1000)]
        public int SortOrder { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
