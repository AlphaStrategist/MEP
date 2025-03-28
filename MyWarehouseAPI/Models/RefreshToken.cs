namespace MyWarehouseAPI.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; } = null!;
        public DateTime ExpiresOn { get; set; }
        public DateTime? RevokedOn { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public User? User { get; set; }
    }
}
