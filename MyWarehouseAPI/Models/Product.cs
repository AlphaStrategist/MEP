namespace MyWarehouseAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = null!;
        public string Category { get; set; } = null!;
        public int Quantity { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public User? Creator { get; set; }
    }
}
