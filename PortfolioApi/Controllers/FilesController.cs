using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using PortfolioApi.Data;
using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Controllers
{
    /// <summary>Uploads (admin) and serves (public) images and PDFs stored in the database.</summary>
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IFileValidator _validator;

        public FilesController(AppDbContext context, IFileValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        [Authorize]
        [HttpPost]
        [RequestSizeLimit(FileValidator.MaxBytes + 64 * 1024)]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file is null) return BadRequest(new { message = "No file was sent." });

            using var buffer = new MemoryStream();
            await file.CopyToAsync(buffer);
            var data = buffer.ToArray();

            var fileName = Path.GetFileName(file.FileName);
            var result = _validator.Validate(fileName, data);
            if (!result.IsValid) return BadRequest(new { message = result.Error });

            var stored = new StoredFile
            {
                FileName = fileName.Length > 255 ? fileName[^255..] : fileName,
                ContentType = result.ContentType!,
                Size = data.Length,
                Data = data
            };

            _context.StoredFile.Add(stored);
            await _context.SaveChangesAsync();

            var url = Url.Action(nameof(Get), new { id = stored.Id })!;
            return Created(url, new { id = stored.Id, url, fileName = stored.FileName, size = stored.Size });
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var file = await _context.StoredFile.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
            if (file is null) return NotFound();

            // Files never change once uploaded (a new upload gets a new id), so they can be cached forever.
            Response.Headers[HeaderNames.CacheControl] = "public, max-age=31536000, immutable";

            // Images display inline; PDFs (the CV) download with their original name.
            return file.ContentType == "application/pdf"
                ? File(file.Data, file.ContentType, file.FileName)
                : File(file.Data, file.ContentType);
        }

        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var file = await _context.StoredFile.FindAsync(id);
            if (file is null) return NotFound();

            _context.StoredFile.Remove(file);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
