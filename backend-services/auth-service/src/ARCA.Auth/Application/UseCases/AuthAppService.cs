using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Application.DTOs;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace AuthService.Application.UseCases;

public class AuthAppService(IUserRepository repository, IConfiguration configuration)
{
    public async Task<AuthResponseDto?> LoginAsync(string username, string password)
    {
        var user = await repository.GetByUsernameAsync(username);
        if (user is null || !user.IsActive || !user.VerifyPassword(password))
            return null;

        return BuildResponse(user);
    }

    public async Task<AuthResponseDto> RegisterAsync(string username, string password, string fullName, string role)
    {
        if (await repository.ExistsAsync(username))
            throw new InvalidOperationException($"El usuario '{username}' ya existe.");

        var user = User.Create(username, password, fullName, role);
        await repository.AddAsync(user);
        await repository.SaveChangesAsync();

        return BuildResponse(user);
    }

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await repository.GetByIdAsync(id);
        return user is null ? null : ToDto(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await repository.GetAllAsync();
        return users.Select(ToDto);
    }

    private AuthResponseDto BuildResponse(User user)
    {
        var secret = configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret no configurado.");
        var expiresAt = DateTime.UtcNow.AddHours(8);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,  user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Name, user.FullName),
            new Claim("username", user.Username),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti,  Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer:   "arca-auth-service",
            audience: "arca-frontend",
            claims:   claims,
            expires:  expiresAt,
            signingCredentials: creds
        );

        return new AuthResponseDto(
            Token:     new JwtSecurityTokenHandler().WriteToken(token),
            Username:  user.Username,
            FullName:  user.FullName,
            Role:      user.Role,
            ExpiresAt: expiresAt
        );
    }

    private static UserDto ToDto(User u) => new(u.Id, u.Username, u.FullName, u.Role, u.IsActive, u.CreatedAt);
}
