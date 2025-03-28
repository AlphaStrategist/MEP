using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyWarehouseAPI.Data;
using MyWarehouseAPI.Dtos;
using MyWarehouseAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace MyWarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email is already in use." });
            }

            var hashedPassword = HashPassword(dto.Password);

            var newUser = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = hashedPassword,
                Role = dto.Role,
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow
            };

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            var accessToken = Guid.NewGuid().ToString();
            newUser.Token = accessToken;
            newUser.TokenExpiry = 3600;
            newUser.LastLogin = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var refreshToken = CreateRefreshToken(newUser.Id);
            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Registration successful.",
                token = accessToken,
                tokenExpiry = newUser.TokenExpiry,
                refreshToken = refreshToken.Token,
                refreshExpiresOn = refreshToken.ExpiresOn,
                user = new { newUser.Id, newUser.Name, newUser.Email, newUser.Role }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            var hashedInput = HashPassword(dto.Password);
            if (user.Password != hashedInput)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            user.LastLogin = DateTime.UtcNow;
            var accessToken = Guid.NewGuid().ToString();
            user.Token = accessToken;
            user.TokenExpiry = 3600;
            user.UpdatedOn = DateTime.UtcNow;

            var refreshToken = await _db.RefreshTokens
                .OrderByDescending(rt => rt.Id)
                .FirstOrDefaultAsync(rt => rt.UserId == user.Id && rt.RevokedOn == null && rt.ExpiresOn > DateTime.UtcNow);
            if (refreshToken == null)
            {
                refreshToken = CreateRefreshToken(user.Id);
                _db.RefreshTokens.Add(refreshToken);
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                token = accessToken,
                tokenExpiry = user.TokenExpiry,
                refreshToken = refreshToken.Token,
                refreshExpiresOn = refreshToken.ExpiresOn,
                user = new { user.Id, user.Name, user.Email, user.Role }
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto dto)
        {
            var existing = await _db.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken);
            if (existing == null || existing.ExpiresOn < DateTime.UtcNow || existing.RevokedOn != null)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token." });
            }

            var user = existing.User;
            if (user == null)
            {
                return Unauthorized(new { message = "Associated user not found." });
            }

            var newAccessToken = Guid.NewGuid().ToString();
            user.Token = newAccessToken;
            user.TokenExpiry = 3600;
            user.UpdatedOn = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                token = newAccessToken,
                tokenExpiry = user.TokenExpiry
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto dto)
        {
            var existing = await _db.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken);
            if (existing != null)
            {
                existing.RevokedOn = DateTime.UtcNow;
                await _db.SaveChangesAsync();
            }
            return Ok(new { message = "Logged out successfully." });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        private RefreshToken CreateRefreshToken(int userId)
        {
            return new RefreshToken
            {
                UserId = userId,
                Token = Guid.NewGuid().ToString(),
                ExpiresOn = DateTime.UtcNow.AddDays(7),
                CreatedOn = DateTime.UtcNow
            };
        }
    }
}
