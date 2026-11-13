namespace PortfolioApi.Models
{
    public class Project : IContentEntity
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ProjectUrl { get; set; }       // live demo / main link
        public string? FrontendRepoUrl { get; set; }
        public string? BackendRepoUrl { get; set; }
        public string Status { get; set; } = ProjectStatuses.Completed;
        public List<string> Features { get; set; } = new();
        public List<string> Technologies { get; set; } = new();
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }

    public static class ProjectStatuses
    {
        public const string Completed = "Completed";
        public const string InProgress = "InProgress";
        public const string Planned = "Planned";

        public const string Pattern = "^(Completed|InProgress|Planned)$";
    }
}
