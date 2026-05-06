using EmployeeService.Domain.Entities;

namespace EmployeeService.Infrastructure.Persistence;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        if (context.Employees.Any()) return;

        var employees = new[]
        {
            Employee.Create("Ana Silva",       "1234567",  "Tecnología", "Desarrolladora Senior",  15000m, new DateTime(2023, 3, 15)),
            Employee.Create("Carlos Mendoza",  "2345678",  "Finanzas",   "Analista Financiero",     8000m,  new DateTime(2025, 1, 10)),
            Employee.Create("Lucía Torres",    "3456789",  "RR.HH.",     "Gestora de Personal",     9500m,  new DateTime(2022, 8, 1)),
            Employee.Create("Marco Quispe",    "4567890",  "Tecnología", "Arquitecto de Software",  18000m, new DateTime(2021, 5, 20)),
            Employee.Create("Sofía Romero",    "5678901",  "Comercial",  "Ejecutiva de Ventas",     7500m,  new DateTime(2024, 11, 3)),
        };

        context.Employees.AddRange(employees);
        context.SaveChanges();
    }
}
