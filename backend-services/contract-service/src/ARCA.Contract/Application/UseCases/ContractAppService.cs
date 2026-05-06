using ContractService.Application.DTOs;
using ContractService.Domain.Entities;
using ContractService.Domain.Interfaces;
using ContractService.Domain.Services;

namespace ContractService.Application.UseCases;

public class ContractAppService(IContractRepository repository)
{
    public async Task<IEnumerable<ContractRecordDto>> GetAllAsync()
    {
        var records = await repository.GetAllAsync();
        return records.Select(ToDto);
    }

    public async Task<ContractRecordDto?> GetByIdAsync(Guid id)
    {
        var record = await repository.GetByIdAsync(id);
        return record is null ? null : ToDto(record);
    }

    public async Task<(byte[] PdfBytes, string FileName)> GenerateAndStoreAsync(GenerateContractRequest request)
    {
        if (!DateTime.TryParse(request.FechaIngreso, out var entryDate))
            throw new ArgumentException($"Formato de fecha inválido: '{request.FechaIngreso}'. Use YYYY-MM-DD.");

        var record = ContractRecord.Create(
            request.EmployeeName,
            request.EmployeePosition,
            request.EmployeeArea,
            entryDate,
            request.Salario,
            request.TiempoPrueba
        );

        var pdfBytes = ContractPdfGenerator.Generate(record);

        await repository.AddAsync(record);
        await repository.SaveChangesAsync();

        var fileName = $"Contrato_{record.EmployeeName.Replace(" ", "_")}_{record.GeneratedAt:yyyyMMdd}.pdf";
        return (pdfBytes, fileName);
    }

    public async Task<(byte[] PdfBytes, string FileName)?> RegenerateAsync(Guid id)
    {
        var record = await repository.GetByIdAsync(id);
        if (record is null) return null;

        var pdfBytes = ContractPdfGenerator.Generate(record);
        var fileName = $"Contrato_{record.EmployeeName.Replace(" ", "_")}_{record.GeneratedAt:yyyyMMdd}.pdf";
        return (pdfBytes, fileName);
    }

    private static ContractRecordDto ToDto(ContractRecord r) => new(
        r.Id,
        r.EmployeeName,
        r.EmployeePosition,
        r.EmployeeArea,
        r.EntryDate,
        r.Salary,
        r.ProbationMonths,
        r.GeneratedAt,
        $"Contrato_{r.EmployeeName.Replace(" ", "_")}_{r.GeneratedAt:yyyyMMdd}.pdf"
    );
}
