namespace PortfolioApi.Models
{
    /// <summary>
    /// An uploaded file (image or PDF) kept in PostgreSQL so it survives container redeploys.
    /// </summary>
    public class StoredFile
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long Size { get; set; }
        public byte[] Data { get; set; } = Array.Empty<byte>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
