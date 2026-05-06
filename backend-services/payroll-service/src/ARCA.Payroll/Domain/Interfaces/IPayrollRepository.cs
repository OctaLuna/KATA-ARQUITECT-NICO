using PayrollService.Domain.Entities;

namespace PayrollService.Domain.Interfaces;

public interface IPayrollRepository
{
    Task<IEnumerable<PayrollRecord>> GetAllAsync();
    Task<IEnumerable<PayrollRecord>> GetByEmployeeIdAsync(Guid employeeId);
    Task<bool> ExistsAsync(Guid employeeId, int year, int month);
    Task AddAsync(PayrollRecord record);
    Task SaveChangesAsync();
}
