namespace PayrollService.Application.DTOs;

public record GeneratePayrollRequest(int Year, int Month);

public record PayrollRecordDto(
    Guid Id,
    Guid EmployeeId,
    string EmployeeName,
    string EmployeePosition,
    string EmployeeArea,
    int Year,
    int Month,
    decimal BaseSalary,
    decimal AfpDiscount,
    decimal NetSalary,
    DateTime GeneratedAt
);

public record PayrollSummaryDto(
    int Year,
    int Month,
    int TotalEmployees,
    int NewRecordsCreated,
    int AlreadyExisted,
    IEnumerable<PayrollRecordDto> Records
);
