using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.DTOs.Validation
{
    /// <summary>
    /// Limits how many items a string list may hold and how long each item may be.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class StringListAttribute : ValidationAttribute
    {
        public int MaxItems { get; }
        public int MaxItemLength { get; }

        public StringListAttribute(int maxItems, int maxItemLength)
            : base("{0} may contain at most {1} items of up to {2} characters each.")
        {
            MaxItems = maxItems;
            MaxItemLength = maxItemLength;
        }

        public override string FormatErrorMessage(string name) =>
            string.Format(ErrorMessageString, name, MaxItems, MaxItemLength);

        public override bool IsValid(object? value)
        {
            if (value is null) return true;
            if (value is not IEnumerable<string> items) return false;

            var list = items.ToList();
            return list.Count <= MaxItems && list.All(item => item is not null && item.Length <= MaxItemLength);
        }
    }
}
