using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ARCA.Payroll.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PayrollRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    EmployeeName = table.Column<string>(type: "TEXT", nullable: false),
                    EmployeePosition = table.Column<string>(type: "TEXT", nullable: false),
                    EmployeeArea = table.Column<string>(type: "TEXT", nullable: false),
                    Year = table.Column<int>(type: "INTEGER", nullable: false),
                    Month = table.Column<int>(type: "INTEGER", nullable: false),
                    BaseSalary = table.Column<decimal>(type: "TEXT", nullable: false),
                    AfpDiscount = table.Column<decimal>(type: "TEXT", nullable: false),
                    NetSalary = table.Column<decimal>(type: "TEXT", nullable: false),
                    GeneratedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayrollRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PayrollRecords_EmployeeId_Year_Month",
                table: "PayrollRecords",
                columns: new[] { "EmployeeId", "Year", "Month" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PayrollRecords");
        }
    }
}
