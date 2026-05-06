using System.Text.Json.Serialization;

namespace ContractService.Application.DTOs;

// Campos en español para compatibilidad exacta con el frontend
public record GenerateContractRequest(
    [property: JsonPropertyName("employeeName")]     string EmployeeName,
    [property: JsonPropertyName("employeePosition")] string EmployeePosition,
    [property: JsonPropertyName("employeeArea")]     string EmployeeArea,
    [property: JsonPropertyName("fecha_ingreso")]    string FechaIngreso,
    [property: JsonPropertyName("salario")]          decimal Salario,
    [property: JsonPropertyName("tiempo_prueba")]    int TiempoPrueba
);

public record ContractRecordDto(
    Guid Id,
    string EmployeeName,
    string EmployeePosition,
    string EmployeeArea,
    DateTime EntryDate,
    decimal Salary,
    int ProbationMonths,
    DateTime GeneratedAt,
    string FileName
);
