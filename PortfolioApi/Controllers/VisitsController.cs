using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;
using Microsoft.AspNetCore.RateLimiting;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VisitsController(AppDbContext context)
        {
            _context = context;
        }

        [EnableRateLimiting("public-post")]
        [HttpPost]
        public async Task<IActionResult> Record()
        {
            _context.Visit.Add(new Visit());
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var now = DateTime.UtcNow;
            var startOfToday = now.Date;
            var weekAgo = now.AddDays(-7);

            var total = await _context.Visit.CountAsync();
            var today = await _context.Visit.CountAsync(v => v.VisitedAt >= startOfToday);
            var lastWeek = await _context.Visit.CountAsync(v => v.VisitedAt >= weekAgo);

            return Ok(new { total, today, lastWeek });
        }
    }
}