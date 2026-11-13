using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Data;
using PortfolioApi.DTOs;
using PortfolioApi.DTOs.Validation;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    public class EducationController : ContentControllerBase<Education, EducationDto>
    {
        public EducationController(AppDbContext context) : base(context) { }

        protected override IQueryable<Education> Order(IQueryable<Education> query) =>
            query.OrderBy(e => e.SortOrder).ThenByDescending(e => e.StartDate);

        protected override void Map(EducationDto dto, Education entity)
        {
            entity.Institution = dto.Institution.Trim();
            entity.Degree = dto.Degree.Trim();
            entity.FieldOfStudy = ListCleaner.NullIfBlank(dto.FieldOfStudy);
            entity.Location = ListCleaner.NullIfBlank(dto.Location);
            entity.StartDate = dto.StartDate;
            entity.EndDate = dto.EndDate;
            entity.Gpa = ListCleaner.NullIfBlank(dto.Gpa);
            entity.Description = ListCleaner.NullIfBlank(dto.Description);
            entity.Subjects = ListCleaner.Clean(dto.Subjects);
            entity.SortOrder = dto.SortOrder;
            entity.IsActive = dto.IsActive;
        }
    }
}
