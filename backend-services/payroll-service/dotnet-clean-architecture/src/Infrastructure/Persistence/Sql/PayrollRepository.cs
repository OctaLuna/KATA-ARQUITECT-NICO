using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PayrollService.Domain.Entities;
using PayrollService.Domain.Repositories;

namespace PayrollService.Infrastructure.Persistence.Sql;

public class PayrollRepository : IPayrollRepository
{
    private readonly AppDbContext _context;

    public PayrollRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Payroll> SaveAsync(Payroll payroll)
    {
        _context.Payrolls.Add(payroll);
        await _context.SaveChangesAsync();
        return payroll;
    }

    public async Task<IEnumerable<Payroll>> GetAllAsync()
    {
        return await _context.Payrolls.ToListAsync();
    }

    public async Task<IEnumerable<Payroll>> GetByEmployeeIdAsync(string employeeId)
    {
        return await _context.Payrolls.Where(p => p.EmployeeId == employeeId).ToListAsync();
    }
}
