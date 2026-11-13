using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Data;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Models;
using PortfolioApi.DTOs;
using Microsoft.AspNetCore.Authorization;

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

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var projects = await _context.Project
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(projects);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var Project = await _context.Project
                .Where(p => p.IsActive)
                .ToListAsync();

            return Ok(Project);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _context.Project.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var project = new Project
            {
                Name = dto.Name,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                ProjectUrl = dto.ProjectUrl,
            };
            _context.Project.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProjectDto dto)
        {
            var project = await _context.Project.FindAsync(id);

            if (project == null)
                return NotFound();

            project.Name = dto.Name;
            project.Description = dto.Description;
            project.ImageUrl = dto.ImageUrl;
            project.ProjectUrl = dto.ProjectUrl;
            project.IsActive = dto.IsActive;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(project);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _context.Project.FindAsync(id);

            if (project == null)
                return NotFound();

            _context.Project.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
