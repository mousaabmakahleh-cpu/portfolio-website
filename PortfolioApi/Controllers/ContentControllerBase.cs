using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;

namespace PortfolioApi.Controllers
{
    /// <summary>
    /// Standard CRUD for portfolio content: public read of visible items, admin-only write.
    /// Derived controllers only describe how a DTO maps onto the entity and how items are ordered.
    /// </summary>
    [ApiController]
    public abstract class ContentControllerBase<TEntity, TDto> : ControllerBase
        where TEntity : class, IContentEntity, new()
        where TDto : class
    {
        protected readonly AppDbContext Context;

        protected ContentControllerBase(AppDbContext context)
        {
            Context = context;
        }

        protected DbSet<TEntity> Items => Context.Set<TEntity>();

        /// <summary>Copies validated DTO values onto the entity.</summary>
        protected abstract void Map(TDto dto, TEntity entity);

        /// <summary>Display order; SortOrder first, then a type-specific rule.</summary>
        protected abstract IQueryable<TEntity> Order(IQueryable<TEntity> query);

        [HttpGet]
        public async Task<IActionResult> GetVisible() =>
            Ok(await Order(Items.AsNoTracking().Where(e => e.IsActive)).ToListAsync());

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll() =>
            Ok(await Order(Items.AsNoTracking()).ToListAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await Items.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
            var isAdmin = User.Identity?.IsAuthenticated == true;

            return item is null || (!item.IsActive && !isAdmin) ? NotFound() : Ok(item);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(TDto dto)
        {
            var item = new TEntity();
            Map(dto, item);

            Items.Add(item);
            await Context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, TDto dto)
        {
            var item = await Items.FindAsync(id);
            if (item is null) return NotFound();

            Map(dto, item);
            await Context.SaveChangesAsync();

            return Ok(item);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await Items.FindAsync(id);
            if (item is null) return NotFound();

            Items.Remove(item);
            await Context.SaveChangesAsync();

            return NoContent();
        }
    }
}
