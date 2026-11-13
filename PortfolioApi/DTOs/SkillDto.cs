using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.DTOs
{
    public class SkillDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 100)]
        public int Level { get; set; }

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}