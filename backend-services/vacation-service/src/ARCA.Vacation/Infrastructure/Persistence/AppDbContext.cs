using Microsoft.EntityFrameworkCore;
using VacationService.Domain.Entities;

namespace VacationService.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<VacationBalance> VacationBalances => Set<VacationBalance>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VacationBalance>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.Property(v => v.EmployeeName).IsRequired().HasMaxLength(150);
            entity.Property(v => v.TotalDays).IsRequired();
            entity.Property(v => v.UsedDays).IsRequired();
            entity.Property(v => v.IsEligible).IsRequired();
            // Garantiza un solo saldo por empleado por año de gestión
            entity.HasIndex(v => new { v.EmployeeId, v.ManagementYear }).IsUnique();
        });
    }
}
