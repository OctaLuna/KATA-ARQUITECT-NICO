using Microsoft.EntityFrameworkCore;
using PayrollService.Domain.Entities;

namespace PayrollService.Infrastructure.Persistence.Sql;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Payroll> Payrolls { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Payroll>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EmployeeId).IsRequired();
            entity.Property(e => e.EmployeeName).IsRequired();
            entity.Property(e => e.Period).IsRequired();
            entity.ToTable("HISTORICO_PAGOS");
        });
    }
}
