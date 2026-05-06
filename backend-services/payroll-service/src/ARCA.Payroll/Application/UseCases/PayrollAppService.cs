using PayrollService.Application.DTOs;
using PayrollService.Domain.Entities;
using PayrollService.Domain.Interfaces;
using PayrollService.Infrastructure.HttpClients;

namespace PayrollService.Application.UseCases;

public class PayrollAppService(IPayrollRepository repository, IEmployeeServiceClient employeeClient)
{
    public async Task<IEnumerable<PayrollRecordDto>> GetAllAsync()
    {
        var records = await repository.GetAllAsync();
        return records.Select(ToDto);
    }

    public async Task<IEnumerable<PayrollRecordDto>> GetByEmployeeIdAsync(Guid employeeId)
    {
        var records = await repository.GetByEmployeeIdAsync(employeeId);
        return records.Select(ToDto);
    }

    public async Task<PayrollSummaryDto> GeneratePayrollAsync(int year, int month)
    {
        if (month < 1 || month > 12)
            throw new ArgumentException("El mes debe estar entre 1 y 12.");
        if (year < 2000 || year > 2100)
            throw new ArgumentException("El año debe estar entre 2000 y 2100.");

        var employees = (await employeeClient.GetActiveEmployeesAsync()).ToList();

        int newRecords = 0, alreadyExisted = 0;
        var createdDtos = new List<PayrollRecordDto>();

        foreach (var emp in employees)
        {
            if (await repository.ExistsAsync(emp.Id, year, month))
            {
                alreadyExisted++;
                continue;
            }

            var record = PayrollRecord.Create(
                emp.Id, emp.FullName, emp.Position, emp.Area, year, month, emp.Salary);

            await repository.AddAsync(record);
            newRecords++;
            createdDtos.Add(ToDto(record));
        }

        await repository.SaveChangesAsync();

        return new PayrollSummaryDto(year, month, employees.Count, newRecords, alreadyExisted, createdDtos);
    }

    private static PayrollRecordDto ToDto(PayrollRecord r) => new(
        r.Id,
        r.EmployeeId,
        r.EmployeeName,
        r.EmployeePosition,
        r.EmployeeArea,
        r.Year,
        r.Month,
        r.BaseSalary,
        r.AfpDiscount,
        r.NetSalary,
        r.GeneratedAt
    );
}
