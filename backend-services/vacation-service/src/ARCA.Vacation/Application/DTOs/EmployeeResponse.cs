namespace VacationService.Application.DTOs;

// Contrato de respuesta del employee-service — solo los campos que necesitamos
public record EmployeeResponse(
    Guid Id,
    string FullName,
    DateTime EntryDate,
    string Status
);
