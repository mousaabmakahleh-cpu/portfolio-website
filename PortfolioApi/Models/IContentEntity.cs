namespace PortfolioApi.Models
{
    /// <summary>
    /// Shared shape of portfolio content that the admin can show/hide and reorder.
    /// </summary>
    public interface IContentEntity
    {
        int Id { get; set; }
        bool IsActive { get; set; }
        int SortOrder { get; set; }
    }
}
