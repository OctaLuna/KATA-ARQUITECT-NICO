using Microsoft.AspNetCore.Mvc;
using PayrollService.Application.DTOs;
using PayrollService.Application.UseCases;

namespace PayrollService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PayrollController(PayrollAppService service) : ControllerBase
{
    [HttpPost("generate")]
    [ProducesResponseType(typeof(PayrollSummaryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> Generate([FromBody] GeneratePayrollRequest request)
    {
        try
        {
            var summary = await service.GeneratePayrollAsync(request.Year, request.Month);
            return Ok(summary);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, new { error = "No se pudo conectar con employee-service.", detail = ex.Message });
        }
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PayrollRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll() =>
        Ok(await service.GetAllAsync());

    [HttpGet("employee/{employeeId:guid}")]
    [ProducesResponseType(typeof(IEnumerable<PayrollRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByEmployee(Guid employeeId) =>
        Ok(await service.GetByEmployeeIdAsync(employeeId));
}
