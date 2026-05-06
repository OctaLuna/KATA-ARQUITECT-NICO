using ContractService.Application.UseCases;
using ContractService.Domain.Interfaces;
using ContractService.Infrastructure.Persistence;
using ContractService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Infrastructure;

// Licencia comunitaria QuestPDF (gratuita para proyectos < $1M ingresos)
QuestPDF.Settings.License = LicenseType.Community;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ARCA - Contract Service", Version = "v1" });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=contract.db"));

builder.Services.AddScoped<IContractRepository, ContractRepository>();
builder.Services.AddScoped<ContractAppService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Content-Disposition"));
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Contract Service v1"));

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
