using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Data;
using PortfolioApi.DTOs;
using PortfolioApi.DTOs.Validation;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    public class ExperienceController : ContentControllerBase<Experience, ExperienceDto>
    {
        public ExperienceController(AppDbContext context) : base(context) { }

        protected override IQueryable<Experience> Order(IQueryable<Experience> query) =>
            query.OrderBy(e => e.SortOrder).ThenByDescending(e => e.StartDate);

        protected override void Map(ExperienceDto dto, Experience entity)
        {
            entity.Title = dto.Title.Trim();
            entity.Organization = dto.Organization.Trim();
            entity.Type = dto.Type;
            entity.Location = ListCleaner.NullIfBlank(dto.Location);
            entity.StartDate = dto.StartDate!.Value; // [Required] guarantees a value
            entity.EndDate = dto.EndDate;
            entity.Description = ListCleaner.NullIfBlank(dto.Description);
            entity.Highlights = ListCleaner.Clean(dto.Highlights);
            entity.Skills = ListCleaner.Clean(dto.Skills);
            entity.SortOrder = dto.SortOrder;
            entity.IsActive = dto.IsActive;
        }
    }
}
