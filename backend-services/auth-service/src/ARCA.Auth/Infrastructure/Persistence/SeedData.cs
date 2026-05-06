using AuthService.Domain.Entities;

namespace AuthService.Infrastructure.Persistence;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var users = new[]
        {
            User.Create("admin",    "Arca@2026!",  "Administrador ARCA",       "Admin"),
            User.Create("rrhh",     "Rrhh@2026!",  "Gestor de Recursos Humanos","RRHH"),
            User.Create("finanzas", "Fin@2026!",   "Analista de Finanzas",      "Finanzas"),
        };

        context.Users.AddRange(users);
        context.SaveChanges();
    }
}
