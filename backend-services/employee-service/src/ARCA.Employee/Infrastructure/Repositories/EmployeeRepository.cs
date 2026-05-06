using EmployeeService.Domain.Entities;
using EmployeeService.Domain.Interfaces;
using EmployeeService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EmployeeService.Infrastructure.Repositories;

public class EmployeeRepository(AppDbContext context) : IEmployeeRepository
{
    public async Task<IEnumerable<Employee>> GetAllAsync() =>
        await context.Employees.OrderBy(e => e.FullName).ToListAsync();

    public async Task<Employee?> GetByIdAsync(Guid id) =>
        await context.Employees.FindAsync(id);

    public async Task AddAsync(Employee employee) =>
        await context.Employees.AddAsync(employee);

    public Task UpdateAsync(Employee employee)
    {
        context.Employees.Update(employee);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync() =>
        await context.SaveChangesAsync();
}
