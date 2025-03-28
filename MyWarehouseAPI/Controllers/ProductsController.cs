using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWarehouseAPI.Data;
using MyWarehouseAPI.Dtos;
using MyWarehouseAPI.Models;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _db.Products
            .Include(p => p.Creator)
            .OrderByDescending(p => p.CreatedOn)
            .ToListAsync();

        return Ok(products);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddProduct([FromBody] AddProductDto dto)
    {
        if (dto.Quantity < 1 || dto.Quantity > 100)
        {
            return BadRequest(new { message = "Quantity must be between 1 and 100." });
        }

        var product = new Product
        {
            ProductName = dto.ProductName,
            Category = dto.Category,
            Quantity = dto.Quantity,
            CreatedOn = DateTime.UtcNow,
            UpdatedOn = DateTime.UtcNow,
            CreatedBy = dto.UserId
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Product added successfully.", productId = product.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "Product not found." });
        }

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Product deleted successfully." });
    }
}
