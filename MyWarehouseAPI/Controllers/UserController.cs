using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWarehouseAPI.Data;

namespace MyWarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly AppDbContext _db;

        public UserController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == dto.Id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (user.Email != dto.Email)
            {
                var emailCheck = await _db.Users.AnyAsync(u => u.Email == dto.Email);
                if (emailCheck)
                {
                    return BadRequest(new { message = "Email is already in use." });
                }
            }

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.UpdatedOn = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { message = "User updated successfully." });
        }

    }
}
