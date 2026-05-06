using System.Text.Json;

namespace PayrollService.Infrastructure.HttpClients;

public class EmployeeServiceClient(HttpClient httpClient) : IEmployeeServiceClient
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<IEnumerable<EmployeeDto>> GetActiveEmployeesAsync()
    {
        var response = await httpClient.GetAsync("/api/employees");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var employees = JsonSerializer.Deserialize<IEnumerable<EmployeeDto>>(json, JsonOptions)
                        ?? Enumerable.Empty<EmployeeDto>();

        return employees.Where(e => e.Status == "Active");
    }
}
