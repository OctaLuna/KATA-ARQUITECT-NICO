using Microsoft.EntityFrameworkCore;
using VacationService.Domain.Entities;
using VacationService.Domain.Interfaces;
using VacationService.Infrastructure.Persistence;

namespace VacationService.Infrastructure.Repositories;

public class VacationRepository(AppDbContext context) : IVacationRepository
{
    public async Task<IEnumerable<VacationBalance>> GetAllAsync() =>
        await context.VacationBalances
            .OrderBy(v => v.EmployeeName)
            .ToListAsync();

    public async Task<VacationBalance?> GetByEmployeeIdAsync(Guid employeeId) =>
        await context.VacationBalances
            .Where(v => v.EmployeeId == employeeId && v.ManagementYear == DateTime.Today.Year)
            .FirstOrDefaultAsync();

    public async Task<VacationBalance?> GetByEmployeeAndYearAsync(Guid employeeId, int year) =>
        await context.VacationBalances
            .FirstOrDefaultAsync(v => v.EmployeeId == employeeId && v.ManagementYear == year);

    public async Task<bool> ExistsAsync(Guid employeeId, int year) =>
        await context.VacationBalances
            .AnyAsync(v => v.EmployeeId == employeeId && v.ManagementYear == year);

    public async Task AddAsync(VacationBalance balance) =>
        await context.VacationBalances.AddAsync(balance);

    public Task UpdateAsync(VacationBalance balance)
    {
        context.VacationBalances.Update(balance);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await context.SaveChangesAsync();
}
