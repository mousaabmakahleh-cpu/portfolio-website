namespace PortfolioApi.Models
{
    public class Education : IContentEntity
    {
        public int Id { get; set; }
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string? FieldOfStudy { get; set; }
        public string? Location { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; } // null = present / expected
        public string? Gpa { get; set; }       // free text, e.g. "3.4 / 4.0" or "Very Good"
        public string? Description { get; set; }
        public List<string> Subjects { get; set; } = new();
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
