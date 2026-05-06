namespace VacationService.Domain.Services;

public static class VacationEligibilityService
{
    private const int DaysPerYear = 365;
    private const int VacationDaysPerYear = 15;

    public static (bool IsEligible, int TotalDays) Calculate(DateTime entryDate, DateTime referenceDate)
    {
        var seniority = referenceDate.Date - entryDate.Date;
        var isEligible = seniority.TotalDays >= DaysPerYear;
        return (isEligible, isEligible ? VacationDaysPerYear : 0);
    }
}
