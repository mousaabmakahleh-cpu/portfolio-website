using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PortfolioApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPortfolioContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackendRepoUrl",
                table: "Project",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Features",
                table: "Project",
                type: "text[]",
                nullable: false,
                defaultValueSql: "'{}'::text[]");

            migrationBuilder.AddColumn<string>(
                name: "FrontendRepoUrl",
                table: "Project",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "Project",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Project",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Completed");

            migrationBuilder.AddColumn<List<string>>(
                name: "Technologies",
                table: "Project",
                type: "text[]",
                nullable: false,
                defaultValueSql: "'{}'::text[]");

            migrationBuilder.CreateTable(
                name: "Certification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Issuer = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IssueDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Hours = table.Column<int>(type: "integer", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    CredentialUrl = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    LearnedTopics = table.Column<List<string>>(type: "text[]", nullable: false),
                    Skills = table.Column<List<string>>(type: "text[]", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certification", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Education",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Institution = table.Column<string>(type: "text", nullable: false),
                    Degree = table.Column<string>(type: "text", nullable: false),
                    FieldOfStudy = table.Column<string>(type: "text", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Gpa = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Subjects = table.Column<List<string>>(type: "text[]", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Education", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Experience",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Organization = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Highlights = table.Column<List<string>>(type: "text[]", nullable: false),
                    Skills = table.Column<List<string>>(type: "text[]", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Experience", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteProfile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    GitHubUrl = table.Column<string>(type: "text", nullable: true),
                    LinkedInUrl = table.Column<string>(type: "text", nullable: true),
                    CvUrl = table.Column<string>(type: "text", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StoredFile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Size = table.Column<long>(type: "bigint", nullable: false),
                    Data = table.Column<byte[]>(type: "bytea", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoredFile", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Certification_IsActive_IssueDate",
                table: "Certification",
                columns: new[] { "IsActive", "IssueDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Experience_IsActive_StartDate",
                table: "Experience",
                columns: new[] { "IsActive", "StartDate" });

            // One-time seed: certificates already earned (details taken from the certificate images)
            // and the public GitHub link. Everything else is managed from the admin dashboard.
            migrationBuilder.Sql("""
                INSERT INTO "Certification"
                    ("Title", "Issuer", "StartDate", "IssueDate", "Hours", "ImageUrl", "CredentialUrl", "Description", "LearnedTopics", "Skills", "SortOrder", "IsActive")
                VALUES
                    ('ASP.NET MVC Core (8)', 'Step By Step Training & Consulting', DATE '2025-08-16', DATE '2026-02-09', 90,
                     '/images/certificates/aspnet-mvc-core.jpeg', NULL,
                     'Certificate of achievement for completing a 90-hour ASP.NET MVC Core 8 course.',
                     ARRAY[]::text[], ARRAY['ASP.NET Core MVC', 'C#']::text[], 0, TRUE),
                    ('Software Development Processes and Methodologies', 'University of Minnesota (Coursera)', NULL, DATE '2026-05-25', NULL,
                     '/images/certificates/software-development-processes.jpeg', NULL,
                     'Online course certificate authorized by the University of Minnesota and offered through Coursera.',
                     ARRAY[]::text[], ARRAY['Software Development Life Cycle']::text[], 0, TRUE),
                    ('Concept to Prototype — UI/UX Figma Workshop', 'Zain Zinc', NULL, DATE '2025-08-10', 10,
                     '/images/certificates/ui-ux-figma-workshop.jpeg', NULL,
                     'Certificate of attendance for the "Concept to Prototype" workshop in the UI/UX Figma Workshop Series.',
                     ARRAY[]::text[], ARRAY['Figma', 'UI/UX Design', 'Prototyping']::text[], 0, TRUE);

                INSERT INTO "SiteProfile" ("Id", "Email", "GitHubUrl", "LinkedInUrl", "CvUrl", "Location", "UpdatedAt")
                VALUES (1, NULL, 'https://github.com/mousaabmakahleh-cpu', NULL, NULL, NULL, NOW());
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Certification");

            migrationBuilder.DropTable(
                name: "Education");

            migrationBuilder.DropTable(
                name: "Experience");

            migrationBuilder.DropTable(
                name: "SiteProfile");

            migrationBuilder.DropTable(
                name: "StoredFile");

            migrationBuilder.DropColumn(
                name: "BackendRepoUrl",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "Features",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "FrontendRepoUrl",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "Technologies",
                table: "Project");
        }
    }
}
