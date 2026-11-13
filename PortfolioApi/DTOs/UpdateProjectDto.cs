using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.DTOs
{
    public class UpdateProjectDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ProjectUrl { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
