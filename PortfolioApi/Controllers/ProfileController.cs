using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Data;
using PortfolioApi.DTOs;
using PortfolioApi.DTOs.Validation;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers
{
    /// <summary>Public contact links and CV for the site owner (single row).</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var profile = await _context.SiteProfile.FindAsync(SiteProfile.SingletonId);
            return Ok(profile ?? new SiteProfile());
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update(SiteProfileDto dto)
        {
            var profile = await _context.SiteProfile.FindAsync(SiteProfile.SingletonId);
            if (profile is null)
            {
                profile = new SiteProfile();
                _context.SiteProfile.Add(profile);
            }

            profile.Email = ListCleaner.NullIfBlank(dto.Email);
            profile.GitHubUrl = ListCleaner.NullIfBlank(dto.GitHubUrl);
            profile.LinkedInUrl = ListCleaner.NullIfBlank(dto.LinkedInUrl);
            profile.CvUrl = ListCleaner.NullIfBlank(dto.CvUrl);
            profile.Location = ListCleaner.NullIfBlank(dto.Location);
            profile.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(profile);
        }
    }
}
