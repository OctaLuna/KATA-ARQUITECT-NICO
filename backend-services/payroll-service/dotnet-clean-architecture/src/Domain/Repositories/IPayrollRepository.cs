using System.Collections.Generic;
using System.Threading.Tasks;
using PayrollService.Domain.Entities;

namespace PayrollService.Domain.Repositories;

public interface IPayrollRepository
{
    Task<Payroll> SaveAsync(Payroll payroll);
    Task<IEnumerable<Payroll>> GetAllAsync();
    Task<IEnumerable<Payroll>> GetByEmployeeIdAsync(string employeeId);
}
