using EmployeeService.Application.DTOs;
using EmployeeService.Domain.Entities;
using EmployeeService.Domain.Interfaces;

namespace EmployeeService.Application.UseCases;

public class EmployeeAppService(IEmployeeRepository repository)
{
    public async Task<IEnumerable<EmployeeDto>> GetAllAsync()
    {
        var employees = await repository.GetAllAsync();
        return employees.Select(ToDto);
    }

    public async Task<EmployeeDto?> GetByIdAsync(Guid id)
    {
        var employee = await repository.GetByIdAsync(id);
        return employee is null ? null : ToDto(employee);
    }

    public async Task<EmployeeDto> RegisterAsync(CreateEmployeeRequest request)
    {
        var employee = Employee.Create(
            request.FullName,
            request.Ci,
            request.Area,
            request.Position,
            request.Salary,
            request.EntryDate
        );

        await repository.AddAsync(employee);
        await repository.SaveChangesAsync();
        return ToDto(employee);
    }

    public async Task<EmployeeDto?> UpdateAsync(Guid id, UpdateEmployeeRequest request)
    {
        var employee = await repository.GetByIdAsync(id);
        if (employee is null) return null;

        employee.Update(request.Area, request.Position, request.Salary);
        await repository.UpdateAsync(employee);
        await repository.SaveChangesAsync();
        return ToDto(employee);
    }

    public async Task<bool> DeactivateAsync(Guid id)
    {
        var employee = await repository.GetByIdAsync(id);
        if (employee is null) return false;

        employee.Deactivate();
        await repository.UpdateAsync(employee);
        await repository.SaveChangesAsync();
        return true;
    }

    private static EmployeeDto ToDto(Employee e) => new(
        e.Id, e.FullName, e.Ci, e.Area, e.Position,
        e.Salary, e.EntryDate, e.Status, e.CreatedAt
    );
}
