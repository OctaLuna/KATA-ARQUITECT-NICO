using Microsoft.EntityFrameworkCore;
using PayrollService.Domain.Entities;
using PayrollService.Domain.Interfaces;
using PayrollService.Infrastructure.Persistence;

namespace PayrollService.Infrastructure.Repositories;

public class PayrollRepository(AppDbContext context) : IPayrollRepository
{
    public async Task<IEnumerable<PayrollRecord>> GetAllAsync()
        => await context.PayrollRecords
            .OrderByDescending(r => r.Year)
            .ThenByDescending(r => r.Month)
            .ThenBy(r => r.EmployeeName)
            .ToListAsync();

    public async Task<IEnumerable<PayrollRecord>> GetByEmployeeIdAsync(Guid employeeId)
        => await context.PayrollRecords
            .Where(r => r.EmployeeId == employeeId)
            .OrderByDescending(r => r.Year)
            .ThenByDescending(r => r.Month)
            .ToListAsync();

    public async Task<bool> ExistsAsync(Guid employeeId, int year, int month)
        => await context.PayrollRecords
            .AnyAsync(r => r.EmployeeId == employeeId && r.Year == year && r.Month == month);

    public async Task AddAsync(PayrollRecord record)
        => await context.PayrollRecords.AddAsync(record);

    public async Task SaveChangesAsync()
        => await context.SaveChangesAsync();
}
