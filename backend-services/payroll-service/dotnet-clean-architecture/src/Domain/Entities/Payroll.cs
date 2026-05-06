namespace PayrollService.Domain.Entities;

public class Payroll
{
    public int Id { get; private set; }
    public string EmployeeId { get; private set; }
    public string EmployeeName { get; private set; }
    public string Period { get; private set; }
    public decimal BaseSalary { get; private set; }
    public decimal Deductions { get; private set; }
    public decimal NetPay { get; private set; }
    public DateTime PaymentDate { get; private set; }

    // Parameterless constructor for EF Core
    protected Payroll() { }

    public Payroll(string employeeId, string employeeName, string period, decimal baseSalary)
    {
        if (string.IsNullOrWhiteSpace(employeeId)) throw new ArgumentException("EmployeeId cannot be empty");
        if (baseSalary < 0) throw new ArgumentException("BaseSalary cannot be negative");

        EmployeeId = employeeId;
        EmployeeName = employeeName;
        Period = period;
        BaseSalary = baseSalary;
        
        // Business logic for deduction
        Deductions = baseSalary * 0.1271m; // Example deduction (12.71% AFP)
        NetPay = baseSalary - Deductions;
        PaymentDate = DateTime.UtcNow;
    }
}
