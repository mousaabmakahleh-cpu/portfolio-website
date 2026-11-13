# Portfolio Website with Admin Dashboard

A personal portfolio website with a secure admin dashboard, built with ASP.NET Core and PostgreSQL.

## Features

**Public website**
- Projects and skills loaded dynamically from the API
- Contact form (messages are saved in the database)
- Light / dark theme toggle
- Visit counter

**Admin dashboard** (`/admin/`)
- Secure login with JWT authentication
- Add, edit, hide and delete projects and skills
- Read and manage contact messages
- Visit statistics (total, today, last 7 days)

**Security**
- Passwords hashed with BCrypt
- Secrets stored outside the code (User Secrets / environment variables)
- Rate limiting on login and public forms
- Security headers (CSP, X-Frame-Options, nosniff, and more)
- Global exception handling (no internal details leaked)

## Tech Stack

- **Backend:** ASP.NET Core Web API (.NET 9), Entity Framework Core
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript (served from `wwwroot`)
- **Auth:** JWT Bearer tokens

## Getting Started

### Requirements
- .NET 9 SDK
- PostgreSQL

### Setup

1. Clone the repository:

```bash
git clone https://github.com/mousaabmakahleh-cpu/portfolio-website.git
cd portfolio-website/PortfolioApi
```

2. Set your secrets (replace the values with your own):

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=portfolio;Username=postgres;Password=YOUR_PASSWORD"
dotnet user-secrets set "Jwt:Key" "A_LONG_RANDOM_SECRET_KEY_AT_LEAST_32_CHARS"
dotnet user-secrets set "Jwt:Issuer" "PortfolioApi"
dotnet user-secrets set "Jwt:Audience" "PortfolioClient"
dotnet user-secrets set "Admin:Username" "admin"
dotnet user-secrets set "Admin:Password" "YOUR_ADMIN_PASSWORD"
```

3. Create the database tables:

```bash
dotnet ef database update
```

4. Run the app:

```bash
dotnet run
```

5. Open the site and the dashboard:
   - Website: `https://localhost:<port>/`
   - Admin: `https://localhost:<port>/admin/`

The admin account is created automatically on first run from the `Admin` settings.

## Project Structure

```text
PortfolioApi/
├── Controllers/   # API endpoints
├── Data/          # DbContext
├── DTOs/          # Request models with validation
├── Middleware/    # Global exception handler
├── Migrations/    # EF Core migrations
├── Models/        # Database entities
└── wwwroot/       # Frontend (site + admin dashboard)
```

## Author

**Mousaab Makahleh** - Software Engineering
GitHub: [@mousaabmakahleh-cpu](https://github.com/mousaabmakahleh-cpu)