namespace PortfolioApi.Models
{
    public class Certification : IContentEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public DateOnly? StartDate { get; set; }
        public DateOnly? IssueDate { get; set; }
        public int? Hours { get; set; }
        public string? ImageUrl { get; set; }
        public string? CredentialUrl { get; set; }
        public string? Description { get; set; }
        public List<string> LearnedTopics { get; set; } = new();
        public List<string> Skills { get; set; } = new();
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
