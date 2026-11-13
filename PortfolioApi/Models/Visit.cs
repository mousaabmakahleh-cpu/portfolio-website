namespace PortfolioApi.Models
{
    public class Visit
    {
        public int Id { get; set; }
        public DateTime VisitedAt { get; set; } = DateTime.UtcNow;
    }
}