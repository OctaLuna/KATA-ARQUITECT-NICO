namespace EmployeeService.Domain.Entities;

public class Employee
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; } = string.Empty;
    public string Ci { get; private set; } = string.Empty;
    public string Area { get; private set; } = string.Empty;
    public string Position { get; private set; } = string.Empty;
    public decimal Salary { get; private set; }
    public DateTime EntryDate { get; private set; }
    public string Status { get; private set; } = "Active";
    public DateTime CreatedAt { get; private set; }

    private Employee() { }

    public static Employee Create(string fullName, string ci, string area, string position, decimal salary, DateTime entryDate)
    {
        if (string.IsNullOrWhiteSpace(fullName)) throw new ArgumentException("El nombre es requerido.");
        if (string.IsNullOrWhiteSpace(ci)) throw new ArgumentException("El CI es requerido.");
        if (salary <= 0) throw new ArgumentException("El salario debe ser mayor a cero.");
        if (entryDate > DateTime.UtcNow) throw new ArgumentException("La fecha de ingreso no puede ser futura.");

        return new Employee
        {
            Id = Guid.NewGuid(),
            FullName = fullName.Trim(),
            Ci = ci.Trim(),
            Area = area.Trim(),
            Position = position.Trim(),
            Salary = salary,
            EntryDate = entryDate.Date,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string area, string position, decimal salary)
    {
        if (salary <= 0) throw new ArgumentException("El salario debe ser mayor a cero.");
        Area = area.Trim();
        Position = position.Trim();
        Salary = salary;
    }

    public void Deactivate()
    {
        if (Status == "Inactive") throw new InvalidOperationException("El funcionario ya está dado de baja.");
        Status = "Inactive";
    }
}
