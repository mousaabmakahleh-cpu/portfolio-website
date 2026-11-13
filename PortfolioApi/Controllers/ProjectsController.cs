using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.DTOs;
using PortfolioApi.DTOs.Validation;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        private static IQueryable<Project> Ordered(IQueryable<Project> query) =>
            query.OrderBy(p => p.SortOrder).ThenByDescending(p => p.CreatedAt);

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllForAdmin() =>
            Ok(await Ordered(_context.Project.AsNoTracking()).ToListAsync());

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await Ordered(_context.Project.AsNoTracking().Where(p => p.IsActive)).ToListAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _context.Project.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            var isAdmin = User.Identity?.IsAuthenticated == true;

            return project is null || (!project.IsActive && !isAdmin) ? NotFound() : Ok(project);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateProjectDto dto)
        {
            var project = new Project();
            Map(dto, project);

            _context.Project.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateProjectDto dto)
        {
            var project = await _context.Project.FindAsync(id);
            if (project == null)
                return NotFound();

            Map(dto, project);
            project.IsActive = dto.IsActive;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(project);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Project.FindAsync(id);
            if (project == null)
                return NotFound();

            _context.Project.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static void Map(CreateProjectDto dto, Project project)
        {
            project.Name = dto.Name.Trim();
            project.Description = dto.Description.Trim();
            project.ImageUrl = ListCleaner.NullIfBlank(dto.ImageUrl);
            project.ProjectUrl = ListCleaner.NullIfBlank(dto.ProjectUrl);
            project.FrontendRepoUrl = ListCleaner.NullIfBlank(dto.FrontendRepoUrl);
            project.BackendRepoUrl = ListCleaner.NullIfBlank(dto.BackendRepoUrl);
            project.Status = dto.Status;
            project.Features = ListCleaner.Clean(dto.Features);
            project.Technologies = ListCleaner.Clean(dto.Technologies);
            project.SortOrder = dto.SortOrder;
        }
    }
}
