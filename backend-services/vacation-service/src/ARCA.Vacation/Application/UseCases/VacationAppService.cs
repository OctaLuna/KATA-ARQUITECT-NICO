using VacationService.Application.DTOs;
using VacationService.Domain.Entities;
using VacationService.Domain.Interfaces;
using VacationService.Domain.Services;
using VacationService.Infrastructure.HttpClients;

namespace VacationService.Application.UseCases;

public class VacationAppService(
    IVacationRepository repository,
    IEmployeeServiceClient employeeClient)
{
    public async Task<IEnumerable<VacationBalanceDto>> GetAllBalancesAsync()
    {
        var balances = await repository.GetAllAsync();
        return balances.Select(ToDto);
    }

    public async Task<VacationBalanceDto?> GetBalanceByEmployeeAsync(Guid employeeId)
    {
        var balance = await repository.GetByEmployeeIdAsync(employeeId);
        return balance is null ? null : ToDto(balance);
    }

    public async Task<CalculationResultDto> CalculateVacationsAsync()
    {
        var employees = await employeeClient.GetActiveEmployeesAsync();
        var currentYear = DateTime.Today.Year;
        var today = DateTime.Today;

        int newRecords = 0;
        int alreadyExisted = 0;
        int eligible = 0;
        int notEligible = 0;

        foreach (var employee in employees)
        {
            if (await repository.ExistsAsync(employee.Id, currentYear))
            {
                alreadyExisted++;
                continue;
            }

            var (isEligible, totalDays) = VacationEligibilityService.Calculate(employee.EntryDate, today);

            var balance = VacationBalance.Create(
                employee.Id,
                employee.FullName,
                currentYear,
                isEligible,
                totalDays
            );

            await repository.AddAsync(balance);
            newRecords++;

            if (isEligible) eligible++;
            else notEligible++;
        }

        await repository.SaveChangesAsync();

        return new CalculationResultDto(
            ManagementYear: currentYear,
            TotalProcessed: newRecords + alreadyExisted,
            NewRecordsCreated: newRecords,
            AlreadyExisted: alreadyExisted,
            Eligible: eligible,
            NotEligible: notEligible
        );
    }

    public async Task<VacationBalanceDto?> UseVacationDaysAsync(Guid employeeId, int days)
    {
        var currentYear = DateTime.Today.Year;
        var balance = await repository.GetByEmployeeAndYearAsync(employeeId, currentYear);
        if (balance is null) return null;

        balance.UseDays(days);
        await repository.UpdateAsync(balance);
        await repository.SaveChangesAsync();
        return ToDto(balance);
    }

    private static VacationBalanceDto ToDto(VacationBalance b) => new(
        b.Id,
        b.EmployeeId,
        b.EmployeeName,
        b.ManagementYear,
        b.TotalDays,
        b.UsedDays,
        b.AvailableDays,
        b.IsEligible,
        b.CalculatedAt
    );
}
