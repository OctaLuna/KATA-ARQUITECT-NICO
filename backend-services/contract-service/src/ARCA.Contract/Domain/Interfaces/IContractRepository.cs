using ContractService.Domain.Entities;

namespace ContractService.Domain.Interfaces;

public interface IContractRepository
{
    Task<IEnumerable<ContractRecord>> GetAllAsync();
    Task<ContractRecord?> GetByIdAsync(Guid id);
    Task AddAsync(ContractRecord record);
    Task SaveChangesAsync();
}
