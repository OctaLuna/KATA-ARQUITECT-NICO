using ContractService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ContractService.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ContractRecord> Contracts => Set<ContractRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ContractRecord>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.EmployeeName).IsRequired().HasMaxLength(150);
            entity.Property(c => c.EmployeePosition).IsRequired().HasMaxLength(100);
            entity.Property(c => c.EmployeeArea).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Salary).HasColumnType("TEXT");
            entity.Property(c => c.ProbationMonths).IsRequired();
            entity.Property(c => c.EntryDate).IsRequired();
            entity.Property(c => c.GeneratedAt).IsRequired();
        });
    }
}
