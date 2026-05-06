namespace ContractService.Domain.Entities;

public class ContractRecord
{
    public Guid Id { get; private set; }
    public string EmployeeName { get; private set; } = string.Empty;
    public string EmployeePosition { get; private set; } = string.Empty;
    public string EmployeeArea { get; private set; } = string.Empty;
    public DateTime EntryDate { get; private set; }
    public decimal Salary { get; private set; }
    public int ProbationMonths { get; private set; }
    public DateTime GeneratedAt { get; private set; }

    private ContractRecord() { }

    public static ContractRecord Create(
        string employeeName,
        string employeePosition,
        string employeeArea,
        DateTime entryDate,
        decimal salary,
        int probationMonths)
    {
        if (string.IsNullOrWhiteSpace(employeeName))
            throw new ArgumentException("El nombre del funcionario es requerido.");
        if (string.IsNullOrWhiteSpace(employeePosition))
            throw new ArgumentException("El cargo es requerido.");
        if (salary <= 0)
            throw new ArgumentException("El salario debe ser mayor a cero.");
        if (probationMonths < 0 || probationMonths > 12)
            throw new ArgumentException("El período de prueba debe estar entre 0 y 12 meses.");
        if (entryDate.Date > DateTime.Today)
            throw new ArgumentException("La fecha de ingreso no puede ser futura.");

        return new ContractRecord
        {
            Id = Guid.NewGuid(),
            EmployeeName = employeeName.Trim(),
            EmployeePosition = employeePosition.Trim(),
            EmployeeArea = employeeArea.Trim(),
            EntryDate = entryDate.Date,
            Salary = salary,
            ProbationMonths = probationMonths,
            GeneratedAt = DateTime.UtcNow
        };
    }
}
