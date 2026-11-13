namespace PortfolioApi.DTOs.Validation
{
    public static class ListCleaner
    {
        /// <summary>Trims items and drops empty ones and duplicates, keeping order.</summary>
        public static List<string> Clean(IEnumerable<string>? items) =>
            (items ?? Enumerable.Empty<string>())
                .Select(item => item?.Trim() ?? string.Empty)
                .Where(item => item.Length > 0)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

        /// <summary>Returns null for blank strings, otherwise the trimmed value.</summary>
        public static string? NullIfBlank(string? value) =>
            string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
