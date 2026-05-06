using ContractService.Application.DTOs;
using ContractService.Application.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace ContractService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController(ContractAppService service) : ControllerBase
{
    [HttpPost("generate")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Generate([FromBody] GenerateContractRequest request)
    {
        try
        {
            var (pdfBytes, fileName) = await service.GenerateAndStoreAsync(request);
            Response.Headers.Append("X-Contract-Generated", "true");
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(IEnumerable<ContractRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll() =>
        Ok(await service.GetAllAsync());

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Regenerate(Guid id)
    {
        var result = await service.RegenerateAsync(id);
        if (result is null) return NotFound(new { error = $"No se encontró el contrato con ID {id}." });

        var (pdfBytes, fileName) = result.Value;
        return File(pdfBytes, "application/pdf", fileName);
    }
}
