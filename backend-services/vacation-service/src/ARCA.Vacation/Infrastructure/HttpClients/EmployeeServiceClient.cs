using System.Net.Http.Json;
using System.Text.Json;
using VacationService.Application.DTOs;

namespace VacationService.Infrastructure.HttpClients;

public interface IEmployeeServiceClient
{
    Task<IEnumerable<EmployeeResponse>> GetActiveEmployeesAsync();
}

public class EmployeeServiceClient(HttpClient httpClient) : IEmployeeServiceClient
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<IEnumerable<EmployeeResponse>> GetActiveEmployeesAsync()
    {
        var response = await httpClient.GetAsync("/api/employees");

        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException(
                $"Employee Service respondió con status {(int)response.StatusCode}.");

        var employees = await response.Content
            .ReadFromJsonAsync<IEnumerable<EmployeeResponse>>(JsonOptions);

        if (employees is null)
            throw new HttpRequestException("Employee Service retornó una respuesta vacía.");

        return employees.Where(e => e.Status == "Active");
    }
}
