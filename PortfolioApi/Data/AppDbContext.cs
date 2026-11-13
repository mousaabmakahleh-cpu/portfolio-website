using Microsoft.EntityFrameworkCore;
using PortfolioApi.Models;

namespace PortfolioApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Skill> Skill { get; set; } = null!;
        public DbSet<Project> Project { get; set; } = null!;
        public DbSet<Message> Message { get; set; } = null!;
        public DbSet<User> User { get; set; } = null!;
        public DbSet<Visit> Visit { get; set; } = null!;
    }
}
