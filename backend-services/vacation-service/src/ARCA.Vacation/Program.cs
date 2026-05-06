using Microsoft.EntityFrameworkCore;
using VacationService.Application.UseCases;
using VacationService.Domain.Interfaces;
using VacationService.Infrastructure.HttpClients;
using VacationService.Infrastructure.Persistence;
using VacationService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ARCA - Vacation Service", Version = "v1" });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=vacation.db"));

// HttpClient tipado apuntando al employee-service (URL configurable en appsettings)
var employeeServiceUrl = builder.Configuration["EmployeeService:BaseUrl"]
    ?? throw new InvalidOperationException("EmployeeService:BaseUrl no está configurado en appsettings.json");

builder.Services.AddHttpClient<IEmployeeServiceClient, EmployeeServiceClient>(client =>
{
    client.BaseAddress = new Uri(employeeServiceUrl);
    client.Timeout = TimeSpan.FromSeconds(10);
});

builder.Services.AddScoped<IVacationRepository, VacationRepository>();
builder.Services.AddScoped<VacationAppService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Vacation Service v1"));

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
