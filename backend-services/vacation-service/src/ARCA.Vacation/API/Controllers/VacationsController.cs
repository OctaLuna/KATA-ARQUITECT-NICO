using Microsoft.AspNetCore.Mvc;
using VacationService.Application.DTOs;
using VacationService.Application.UseCases;

namespace VacationService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class VacationsController(VacationAppService service) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<VacationBalanceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll() =>
        Ok(await service.GetAllBalancesAsync());

    [HttpGet("{employeeId:guid}")]
    [ProducesResponseType(typeof(VacationBalanceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByEmployee(Guid employeeId)
    {
        var balance = await service.GetBalanceByEmployeeAsync(employeeId);
        return balance is null ? NotFound(new { error = $"No se encontró saldo de vacaciones para el funcionario {employeeId} en el año en curso." }) : Ok(balance);
    }

    [HttpPost("calculate")]
    [ProducesResponseType(typeof(CalculationResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> Calculate()
    {
        try
        {
            var result = await service.CalculateVacationsAsync();
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway,
                new { error = "No se pudo conectar al Employee Service.", detail = ex.Message });
        }
    }

    [HttpPut("{employeeId:guid}/use")]
    [ProducesResponseType(typeof(VacationBalanceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UseDays(Guid employeeId, [FromBody] UseVacationDaysRequest request)
    {
        try
        {
            var result = await service.UseVacationDaysAsync(employeeId, request.Days);
            return result is null
                ? NotFound(new { error = $"No se encontró saldo activo para el funcionario {employeeId} en {DateTime.Today.Year}." })
                : Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
