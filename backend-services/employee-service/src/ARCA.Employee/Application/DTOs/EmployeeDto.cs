namespace EmployeeService.Application.DTOs;

public record EmployeeDto(
    Guid Id,
    string FullName,
    string Ci,
    string Area,
    string Position,
    decimal Salary,
    DateTime EntryDate,
    string Status,
    DateTime CreatedAt
);

public record CreateEmployeeRequest(
    string FullName,
    string Ci,
    string Area,
    string Position,
    decimal Salary,
    DateTime EntryDate
);

public record UpdateEmployeeRequest(
    string Area,
    string Position,
    decimal Salary
);
