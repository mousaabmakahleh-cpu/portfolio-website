namespace PortfolioApi.DTOs
{
    public class UpdateProjectDto : CreateProjectDto
    {
        public bool IsActive { get; set; } = true;
    }
}
