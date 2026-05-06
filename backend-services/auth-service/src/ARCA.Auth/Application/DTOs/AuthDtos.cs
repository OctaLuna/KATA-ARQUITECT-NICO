namespace AuthService.Application.DTOs;

public record LoginRequest(string Username, string Password);

public record RegisterRequest(string Username, string Password, string FullName, string Role);

public record AuthResponseDto(
    string Token,
    string Username,
    string FullName,
    string Role,
    DateTime ExpiresAt
);

public record UserDto(
    Guid Id,
    string Username,
    string FullName,
    string Role,
    bool IsActive,
    DateTime CreatedAt
);
