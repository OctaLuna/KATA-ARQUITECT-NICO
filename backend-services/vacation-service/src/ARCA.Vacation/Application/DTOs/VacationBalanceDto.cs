namespace VacationService.Application.DTOs;

public record VacationBalanceDto(
    Guid Id,
    Guid EmployeeId,
    string EmployeeName,
    int ManagementYear,
    int TotalDays,
    int UsedDays,
    int AvailableDays,
    bool IsEligible,
    DateTime CalculatedAt
);

public record CalculationResultDto(
    int ManagementYear,
    int TotalProcessed,
    int NewRecordsCreated,
    int AlreadyExisted,
    int Eligible,
    int NotEligible
);

public record UseVacationDaysRequest(int Days);
