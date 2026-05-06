using PayrollService.Domain.Services;

namespace PayrollService.Domain.Entities;

public class PayrollRecord
{
    public Guid Id { get; private set; }
    public Guid EmployeeId { get; private set; }
    public string EmployeeName { get; private set; } = string.Empty;
    public string EmployeePosition { get; private set; } = string.Empty;
    public string EmployeeArea { get; private set; } = string.Empty;
    public int Year { get; private set; }
    public int Month { get; private set; }
    public decimal BaseSalary { get; private set; }
    public decimal AfpDiscount { get; private set; }
    public decimal NetSalary { get; private set; }
    public DateTime GeneratedAt { get; private set; }

    private PayrollRecord() { }

    public static PayrollRecord Create(
        Guid employeeId,
        string employeeName,
        string employeePosition,
        string employeeArea,
        int year,
        int month,
        decimal baseSalary)
    {
        if (baseSalary <= 0)
            throw new ArgumentException("El salario debe ser mayor a cero.");
        if (month < 1 || month > 12)
            throw new ArgumentException("El mes debe estar entre 1 y 12.");
        if (year < 2000 || year > 2100)
            throw new ArgumentException("El año debe estar entre 2000 y 2100.");
        if (string.IsNullOrWhiteSpace(employeeName))
            throw new ArgumentException("El nombre del empleado es requerido.");

        var afpDiscount = PayrollCalculator.CalculateAfpDiscount(baseSalary);

        return new PayrollRecord
        {
            Id = Guid.NewGuid(),
            EmployeeId = employeeId,
            EmployeeName = employeeName.Trim(),
            EmployeePosition = employeePosition.Trim(),
            EmployeeArea = employeeArea.Trim(),
            Year = year,
            Month = month,
            BaseSalary = baseSalary,
            AfpDiscount = afpDiscount,
            NetSalary = baseSalary - afpDiscount,
            GeneratedAt = DateTime.UtcNow
        };
    }
}
