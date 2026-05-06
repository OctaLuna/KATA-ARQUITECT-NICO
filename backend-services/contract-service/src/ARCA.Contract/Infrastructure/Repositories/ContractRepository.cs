using ContractService.Domain.Entities;
using ContractService.Domain.Interfaces;
using ContractService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ContractService.Infrastructure.Repositories;

public class ContractRepository(AppDbContext context) : IContractRepository
{
    public async Task<IEnumerable<ContractRecord>> GetAllAsync() =>
        await context.Contracts
            .OrderByDescending(c => c.GeneratedAt)
            .ToListAsync();

    public async Task<ContractRecord?> GetByIdAsync(Guid id) =>
        await context.Contracts.FindAsync(id);

    public async Task AddAsync(ContractRecord record) =>
        await context.Contracts.AddAsync(record);

    public async Task SaveChangesAsync() =>
        await context.SaveChangesAsync();
}
