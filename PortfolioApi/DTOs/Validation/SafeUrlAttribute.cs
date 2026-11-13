using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.DTOs.Validation
{
    /// <summary>
    /// Allows null/empty, an absolute http(s) URL, or a site-relative path starting with a single "/".
    /// Blocks javascript:, data: and other schemes that could be abused on the public site.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class SafeUrlAttribute : ValidationAttribute
    {
        public SafeUrlAttribute() : base("{0} must be an http(s) URL or a site path starting with '/'.") { }

        public override bool IsValid(object? value)
        {
            if (value is not string text || string.IsNullOrWhiteSpace(text)) return true;
            if (text.Length > 500) return false;

            if (text.StartsWith('/') && !text.StartsWith("//")) return true;

            return Uri.TryCreate(text, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
        }
    }
}
