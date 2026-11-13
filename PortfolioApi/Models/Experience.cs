namespace PortfolioApi.Models
{
    public class Experience : IContentEntity
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Type { get; set; } = ExperienceTypes.Course;
        public string? Location { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; } // null = present
        public string? Description { get; set; }
        public List<string> Highlights { get; set; } = new();
        public List<string> Skills { get; set; } = new();
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public static class ExperienceTypes
    {
        public const string Job = "Job";
        public const string Internship = "Internship";
        public const string Course = "Course";
        public const string Training = "Training";
        public const string Volunteer = "Volunteer";

        public const string Pattern = "^(Job|Internship|Course|Training|Volunteer)$";
    }
}
