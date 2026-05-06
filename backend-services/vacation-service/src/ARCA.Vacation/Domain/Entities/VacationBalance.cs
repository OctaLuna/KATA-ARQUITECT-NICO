namespace VacationService.Domain.Entities;

public class VacationBalance
{
    public Guid Id { get; private set; }
    public Guid EmployeeId { get; private set; }
    public string EmployeeName { get; private set; } = string.Empty;
    public int ManagementYear { get; private set; }
    public int TotalDays { get; private set; }
    public int UsedDays { get; private set; }
    public bool IsEligible { get; private set; }
    public DateTime CalculatedAt { get; private set; }

    public int AvailableDays => TotalDays - UsedDays;

    private VacationBalance() { }

    public static VacationBalance Create(Guid employeeId, string employeeName, int managementYear, bool isEligible, int totalDays)
    {
        if (string.IsNullOrWhiteSpace(employeeName)) throw new ArgumentException("El nombre del funcionario es requerido.");
        if (managementYear < 2000 || managementYear > 2100) throw new ArgumentException("Año de gestión inválido.");

        return new VacationBalance
        {
            Id = Guid.NewGuid(),
            EmployeeId = employeeId,
            EmployeeName = employeeName.Trim(),
            ManagementYear = managementYear,
            IsEligible = isEligible,
            TotalDays = isEligible ? totalDays : 0,
            UsedDays = 0,
            CalculatedAt = DateTime.UtcNow
        };
    }

    public void UseDays(int days)
    {
        if (days <= 0)
            throw new ArgumentException("La cantidad de días debe ser mayor a cero.");
        if (!IsEligible)
            throw new InvalidOperationException($"El funcionario no tiene saldo de vacaciones para {ManagementYear}.");
        if (days > AvailableDays)
            throw new InvalidOperationException($"Días insuficientes. Disponibles: {AvailableDays}, solicitados: {days}.");

        UsedDays += days;
    }
}
