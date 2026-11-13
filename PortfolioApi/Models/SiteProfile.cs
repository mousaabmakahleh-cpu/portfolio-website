namespace PortfolioApi.Models
{
    /// <summary>
    /// Single-row table with the owner's public links and CV.
    /// </summary>
    public class SiteProfile
    {
        public const int SingletonId = 1;

        public int Id { get; set; } = SingletonId;
        public string? Email { get; set; }
        public string? GitHubUrl { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? CvUrl { get; set; }
        public string? Location { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
