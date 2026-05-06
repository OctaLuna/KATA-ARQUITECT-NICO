namespace PayrollService.Application.DTOs;

public class PayrollRequest
{
    public string EmployeeId { get; set; }
    public string EmployeeName { get; set; }
    public string Period { get; set; }
    public decimal BaseSalary { get; set; }
}

public class PayrollResponse
{
    public int Id { get; set; }
    public string EmployeeId { get; set; }
    public string EmployeeName { get; set; }
    public string Period { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetPay { get; set; }
    public DateTime PaymentDate { get; set; }
}
