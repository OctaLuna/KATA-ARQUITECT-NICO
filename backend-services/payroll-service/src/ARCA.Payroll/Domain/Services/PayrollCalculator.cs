namespace PayrollService.Domain.Services;

public static class PayrollCalculator
{
    // D.S. 23570 — Ley General del Trabajo Bolivia: aporte laboral AFP
    public const decimal AfpRate = 0.1271m;

    public static decimal CalculateAfpDiscount(decimal baseSalary)
        => Math.Round(baseSalary * AfpRate, 2);

    public static decimal CalculateNetSalary(decimal baseSalary)
        => baseSalary - CalculateAfpDiscount(baseSalary);
}
