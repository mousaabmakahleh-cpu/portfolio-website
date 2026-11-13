namespace PortfolioApi.Services
{
    public interface IFileValidator
    {
        /// <summary>
        /// Checks size and real file type (magic bytes, not just the extension).
        /// Returns the detected content type, or an error message.
        /// </summary>
        FileValidationResult Validate(string fileName, ReadOnlySpan<byte> data);
    }

    public sealed record FileValidationResult(bool IsValid, string? ContentType, string? Error)
    {
        public static FileValidationResult Ok(string contentType) => new(true, contentType, null);
        public static FileValidationResult Fail(string error) => new(false, null, error);
    }

    /// <summary>Accepts JPEG, PNG, WebP images and PDF documents up to <see cref="MaxBytes"/>.</summary>
    public sealed class FileValidator : IFileValidator
    {
        public const long MaxBytes = 10 * 1024 * 1024;

        private static readonly Dictionary<string, string> ExtensionTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            [".jpg"] = "image/jpeg",
            [".jpeg"] = "image/jpeg",
            [".png"] = "image/png",
            [".webp"] = "image/webp",
            [".pdf"] = "application/pdf"
        };

        public FileValidationResult Validate(string fileName, ReadOnlySpan<byte> data)
        {
            if (data.Length == 0) return FileValidationResult.Fail("The file is empty.");
            if (data.Length > MaxBytes) return FileValidationResult.Fail("The file is larger than 10 MB.");

            if (!ExtensionTypes.TryGetValue(Path.GetExtension(fileName), out var expected))
                return FileValidationResult.Fail("Only JPG, PNG, WebP and PDF files are allowed.");

            var detected = Detect(data);
            return detected == expected
                ? FileValidationResult.Ok(detected)
                : FileValidationResult.Fail("The file content does not match its extension.");
        }

        private static string? Detect(ReadOnlySpan<byte> data)
        {
            if (data.StartsWith(new byte[] { 0xFF, 0xD8, 0xFF })) return "image/jpeg";
            if (data.StartsWith(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A })) return "image/png";
            if (data.StartsWith("%PDF-"u8)) return "application/pdf";
            if (data.Length >= 12 && data[..4].SequenceEqual("RIFF"u8) && data[8..12].SequenceEqual("WEBP"u8)) return "image/webp";
            return null;
        }
    }
}
