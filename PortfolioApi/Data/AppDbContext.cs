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
        public DbSet<Education> Education { get; set; } = null!;
        public DbSet<Experience> Experience { get; set; } = null!;
        public DbSet<Certification> Certification { get; set; } = null!;
        public DbSet<SiteProfile> SiteProfile { get; set; } = null!;
        public DbSet<StoredFile> StoredFile { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Project>(entity =>
            {
                entity.Property(p => p.Status).HasMaxLength(20).HasDefaultValue(ProjectStatuses.Completed);
                entity.Property(p => p.SortOrder).HasDefaultValue(0);
            });

            modelBuilder.Entity<Experience>(entity =>
            {
                entity.Property(e => e.Type).HasMaxLength(20);
                entity.HasIndex(e => new { e.IsActive, e.StartDate });
            });

            modelBuilder.Entity<Certification>()
                .HasIndex(c => new { c.IsActive, c.IssueDate });

            modelBuilder.Entity<SiteProfile>()
                .Property(p => p.Id)
                .ValueGeneratedNever();

            modelBuilder.Entity<StoredFile>(entity =>
            {
                entity.Property(f => f.FileName).HasMaxLength(255);
                entity.Property(f => f.ContentType).HasMaxLength(100);
            });
        }
    }
}
