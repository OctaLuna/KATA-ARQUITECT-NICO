using VacationService.Domain.Entities;

namespace VacationService.Domain.Interfaces;

public interface IVacationRepository
{
    Task<IEnumerable<VacationBalance>> GetAllAsync();
    Task<VacationBalance?> GetByEmployeeIdAsync(Guid employeeId);
    Task<VacationBalance?> GetByEmployeeAndYearAsync(Guid employeeId, int year);
    Task<bool> ExistsAsync(Guid employeeId, int year);
    Task AddAsync(VacationBalance balance);
    Task UpdateAsync(VacationBalance balance);
    Task SaveChangesAsync();
}
