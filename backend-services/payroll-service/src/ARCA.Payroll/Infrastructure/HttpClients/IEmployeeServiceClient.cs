namespace PayrollService.Infrastructure.HttpClients;

public interface IEmployeeServiceClient
{
    Task<IEnumerable<EmployeeDto>> GetActiveEmployeesAsync();
}

public record EmployeeDto(
    Guid Id,
    string FullName,
    string Position,
    string Area,
    decimal Salary,
    string Status
);
