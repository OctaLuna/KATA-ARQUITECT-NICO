using Microsoft.EntityFrameworkCore;
using PayrollService.Application.UseCases;
using PayrollService.Domain.Interfaces;
using PayrollService.Infrastructure.HttpClients;
using PayrollService.Infrastructure.Persistence;
using PayrollService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ARCA - Payroll Service", Version = "v1" });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=payroll.db"));

builder.Services.AddScoped<IPayrollRepository, PayrollRepository>();
builder.Services.AddScoped<PayrollAppService>();

var employeeBaseUrl = builder.Configuration["EmployeeService:BaseUrl"]
    ?? throw new InvalidOperationException("EmployeeService:BaseUrl no configurado.");

builder.Services.AddHttpClient<IEmployeeServiceClient, EmployeeServiceClient>(client =>
{
    client.BaseAddress = new Uri(employeeBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(10);
});

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
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Payroll Service v1"));

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
