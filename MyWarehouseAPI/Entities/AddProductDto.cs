namespace MyWarehouseAPI.Dtos
{
    public class AddProductDto
    {
        public string ProductName { get; set; } = null!;
        public string Category { get; set; } = null!;
        public int Quantity { get; set; }
        public int UserId { get; set; }
    }
}
