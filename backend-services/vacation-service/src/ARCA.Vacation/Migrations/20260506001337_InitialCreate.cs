using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ARCA.Vacation.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VacationBalances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    EmployeeName = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    ManagementYear = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalDays = table.Column<int>(type: "INTEGER", nullable: false),
                    UsedDays = table.Column<int>(type: "INTEGER", nullable: false),
                    IsEligible = table.Column<bool>(type: "INTEGER", nullable: false),
                    CalculatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VacationBalances", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VacationBalances_EmployeeId_ManagementYear",
                table: "VacationBalances",
                columns: new[] { "EmployeeId", "ManagementYear" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VacationBalances");
        }
    }
}
