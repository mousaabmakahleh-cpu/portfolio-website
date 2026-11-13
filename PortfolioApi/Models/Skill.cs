namespace PortfolioApi.Models
{
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int level { get; set; } // Level of proficiency (1-5)
        public string Category { get; set; } = string.Empty; // Category of the skill (e.g., Programming, Design, etc.)
        public bool IsActive { get; set; } = true;

    }
}
