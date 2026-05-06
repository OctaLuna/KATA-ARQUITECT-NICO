using System.Threading.Tasks;
using PayrollService.Application.DTOs;
using PayrollService.Domain.Entities;
using PayrollService.Domain.Repositories;

namespace PayrollService.Application.UseCases;

public class CreatePayrollUseCase
{
    private readonly IPayrollRepository _payrollRepository;

    public CreatePayrollUseCase(IPayrollRepository payrollRepository)
    {
        _payrollRepository = payrollRepository;
    }

    public async Task<PayrollResponse> ExecuteAsync(PayrollRequest request)
    {
        var payroll = new Payroll(
            request.EmployeeId,
            request.EmployeeName,
            request.Period,
            request.BaseSalary
        );

        var savedPayroll = await _payrollRepository.SaveAsync(payroll);

        return new PayrollResponse
        {
            Id = savedPayroll.Id,
            EmployeeId = savedPayroll.EmployeeId,
            EmployeeName = savedPayroll.EmployeeName,
            Period = savedPayroll.Period,
            BaseSalary = savedPayroll.BaseSalary,
            Deductions = savedPayroll.Deductions,
            NetPay = savedPayroll.NetPay,
            PaymentDate = savedPayroll.PaymentDate
        };
    }
}
