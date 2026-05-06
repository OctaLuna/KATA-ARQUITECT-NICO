using Microsoft.EntityFrameworkCore;
using PayrollService.Domain.Entities;

namespace PayrollService.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<PayrollRecord> PayrollRecords => Set<PayrollRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PayrollRecord>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.BaseSalary).HasColumnType("TEXT");
            e.Property(x => x.AfpDiscount).HasColumnType("TEXT");
            e.Property(x => x.NetSalary).HasColumnType("TEXT");

            // No duplicate payslips per employee per period
            e.HasIndex(x => new { x.EmployeeId, x.Year, x.Month }).IsUnique();
        });
    }
}
