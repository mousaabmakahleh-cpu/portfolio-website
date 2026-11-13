using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.DTOs;
using PortfolioApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SkillsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var skills = await _context.Skill
                .Where(s => s.IsActive)
                .OrderBy(s => s.Category)
                .ThenByDescending(s => s.level)
                .ToListAsync();

            return Ok(skills);
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var skills = await _context.Skill
                .OrderBy(s => s.Category)
                .ThenByDescending(s => s.level)
                .ToListAsync();

            return Ok(skills);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var skill = await _context.Skill.FindAsync(id);

            if (skill == null)
                return NotFound();

            return Ok(skill);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(SkillDto dto)
        {
            var skill = new Skill
            {
                Name = dto.Name,
                level = dto.Level,
                Category = dto.Category,
                IsActive = dto.IsActive
            };

            _context.Skill.Add(skill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = skill.Id }, skill);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SkillDto dto)
        {
            var skill = await _context.Skill.FindAsync(id);

            if (skill == null)
                return NotFound();

            skill.Name = dto.Name;
            skill.level = dto.Level;
            skill.Category = dto.Category;
            skill.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(skill);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var skill = await _context.Skill.FindAsync(id);

            if (skill == null)
                return NotFound();

            _context.Skill.Remove(skill);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}