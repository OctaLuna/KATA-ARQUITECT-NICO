namespace AuthService.Domain.Entities;

public class User
{
    public Guid Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private User() { }

    public static User Create(string username, string plainPassword, string fullName, string role)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("El nombre de usuario es requerido.");
        if (string.IsNullOrWhiteSpace(plainPassword) || plainPassword.Length < 6)
            throw new ArgumentException("La contraseña debe tener al menos 6 caracteres.");
        if (string.IsNullOrWhiteSpace(fullName))
            throw new ArgumentException("El nombre completo es requerido.");

        return new User
        {
            Id = Guid.NewGuid(),
            Username = username.Trim().ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword),
            FullName = fullName.Trim(),
            Role = role.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
    }

    public bool VerifyPassword(string plainPassword)
        => BCrypt.Net.BCrypt.Verify(plainPassword, PasswordHash);

    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;
    public void UpdatePassword(string newPlainPassword)
        => PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPlainPassword);
}
