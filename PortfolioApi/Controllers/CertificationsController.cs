using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Data;
using PortfolioApi.DTOs;
using PortfolioApi.DTOs.Validation;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    public class CertificationsController : ContentControllerBase<Certification, CertificationDto>
    {
        public CertificationsController(AppDbContext context) : base(context) { }

        protected override IQueryable<Certification> Order(IQueryable<Certification> query) =>
            query.OrderBy(c => c.SortOrder).ThenByDescending(c => c.IssueDate);

        protected override void Map(CertificationDto dto, Certification entity)
        {
            entity.Title = dto.Title.Trim();
            entity.Issuer = dto.Issuer.Trim();
            entity.StartDate = dto.StartDate;
            entity.IssueDate = dto.IssueDate;
            entity.Hours = dto.Hours;
            entity.ImageUrl = ListCleaner.NullIfBlank(dto.ImageUrl);
            entity.CredentialUrl = ListCleaner.NullIfBlank(dto.CredentialUrl);
            entity.Description = ListCleaner.NullIfBlank(dto.Description);
            entity.LearnedTopics = ListCleaner.Clean(dto.LearnedTopics);
            entity.Skills = ListCleaner.Clean(dto.Skills);
            entity.SortOrder = dto.SortOrder;
            entity.IsActive = dto.IsActive;
        }
    }
}
