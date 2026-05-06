using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Infrastructure.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task<User?> GetByUsernameAsync(string username)
        => await context.Users.FirstOrDefaultAsync(u => u.Username == username.ToLowerInvariant());

    public async Task<User?> GetByIdAsync(Guid id)
        => await context.Users.FindAsync(id);

    public async Task<IEnumerable<User>> GetAllAsync()
        => await context.Users.OrderBy(u => u.Username).ToListAsync();

    public async Task<bool> ExistsAsync(string username)
        => await context.Users.AnyAsync(u => u.Username == username.ToLowerInvariant());

    public async Task AddAsync(User user)
        => await context.Users.AddAsync(user);

    public async Task SaveChangesAsync()
        => await context.SaveChangesAsync();
}
