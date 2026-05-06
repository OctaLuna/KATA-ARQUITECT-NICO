using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PayrollService.Application.DTOs;
using PayrollService.Application.UseCases;
using PayrollService.Domain.Repositories;

namespace PayrollService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PayrollController : ControllerBase
{
    private readonly CreatePayrollUseCase _createPayrollUseCase;
    private readonly IPayrollRepository _payrollRepository;

    public PayrollController(CreatePayrollUseCase createPayrollUseCase, IPayrollRepository payrollRepository)
    {
        _createPayrollUseCase = createPayrollUseCase;
        _payrollRepository = payrollRepository;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PayrollRequest request)
    {
        var response = await _createPayrollUseCase.ExecuteAsync(request);
        return CreatedAtAction(nameof(GetByEmployeeId), new { employeeId = response.EmployeeId }, response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var payrolls = await _payrollRepository.GetAllAsync();
        return Ok(payrolls);
    }

    [HttpGet("{employeeId}")]
    public async Task<IActionResult> GetByEmployeeId(string employeeId)
    {
        var payrolls = await _payrollRepository.GetByEmployeeIdAsync(employeeId);
        return Ok(payrolls);
    }
}
