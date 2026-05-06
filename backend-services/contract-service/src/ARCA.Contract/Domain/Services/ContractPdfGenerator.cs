using ContractService.Domain.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ContractService.Domain.Services;

public static class ContractPdfGenerator
{
    public static byte[] Generate(ContractRecord contract)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.Letter);
                page.Margin(2.5f, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                page.Header().Element(ComposeHeader);
                page.Content().Element(c => ComposeContent(c, contract));
                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().BorderBottom(2).BorderColor(Colors.Grey.Darken2).PaddingBottom(8).Row(row =>
            {
                row.RelativeItem().Column(c =>
                {
                    c.Item().Text("ARCA LTDA.").Bold().FontSize(18).FontColor(Colors.Grey.Darken3);
                    c.Item().Text("Gestión de Recursos Humanos").FontSize(10).FontColor(Colors.Grey.Medium);
                });
                row.ConstantItem(150).AlignRight().Column(c =>
                {
                    c.Item().Text("Santa Cruz, Bolivia").FontSize(9).FontColor(Colors.Grey.Medium);
                    c.Item().Text($"Fecha: {DateTime.Today:dd/MM/yyyy}").FontSize(9).FontColor(Colors.Grey.Medium);
                });
            });

            col.Item().PaddingTop(16).AlignCenter()
                .Text("CONTRATO INDIVIDUAL DE TRABAJO")
                .Bold().FontSize(14).FontColor(Colors.Grey.Darken3);

            col.Item().AlignCenter().PaddingBottom(4)
                .Text("(Conforme a la Ley General del Trabajo y D.S. 23570 de Bolivia)")
                .Italic().FontSize(9).FontColor(Colors.Grey.Medium);
        });
    }

    private static void ComposeContent(IContainer container, ContractRecord c)
    {
        var entryDateStr = c.EntryDate.ToString("dd 'de' MMMM 'de' yyyy",
            new System.Globalization.CultureInfo("es-BO"));

        container.PaddingTop(20).Column(col =>
        {
            // Introducción
            col.Item().PaddingBottom(16).Text(text =>
            {
                text.Span("Conste por el presente instrumento el Contrato Individual de Trabajo que celebran, " +
                          "de una parte ");
                text.Span("ARCA LTDA.").Bold();
                text.Span(", representada legalmente conforme a ley, a quien en adelante se denominará ");
                text.Span("\"EL EMPLEADOR\"").Bold();
                text.Span("; y de otra parte el/la señor(a) ");
                text.Span($"{c.EmployeeName}").Bold();
                text.Span(", a quien se denominará ");
                text.Span("\"EL TRABAJADOR\"").Bold();
                text.Span(", bajo las siguientes cláusulas y condiciones:");
            });

            // Cláusulas
            var clausulas = new[]
            {
                (
                    "PRIMERA — Objeto y Función",
                    $"EL TRABAJADOR se compromete a prestar sus servicios profesionales en el cargo de " +
                    $"{c.EmployeePosition}, desempeñando sus funciones en el área de {c.EmployeeArea} de EL EMPLEADOR, " +
                    $"sujetándose a las directivas, reglamentos internos y disposiciones que éste imparta."
                ),
                (
                    "SEGUNDA — Fecha de Inicio",
                    $"Las labores objeto del presente contrato darán inicio el día {entryDateStr}, " +
                    $"fecha desde la cual empezarán a computarse todos los derechos y obligaciones laborales " +
                    $"establecidos por la Ley General del Trabajo."
                ),
                (
                    "TERCERA — Remuneración",
                    $"EL EMPLEADOR abonará a EL TRABAJADOR una remuneración mensual de " +
                    $"Bs. {c.Salary:N2} (Bolivianos {c.Salary:N0}/100), pagadera mes vencido mediante depósito " +
                    $"bancario o en efectivo, sujeta a los descuentos legales establecidos por ley " +
                    $"(AFP, CNS y otros que correspondan)."
                ),
                (
                    "CUARTA — Período de Prueba",
                    c.ProbationMonths > 0
                        ? $"El presente contrato está sujeto a un período de prueba de {c.ProbationMonths} " +
                          $"mes(es), conforme al Artículo 13 de la Ley General del Trabajo. Durante este período, " +
                          $"cualquiera de las partes podrá dar por terminado el contrato sin preaviso ni indemnización."
                        : "Las partes acuerdan prescindir del período de prueba, siendo el presente contrato " +
                          "de carácter indefinido desde su suscripción."
                ),
                (
                    "QUINTA — Jornada Laboral",
                    "La jornada de trabajo será de ocho (8) horas diarias y cuarenta y ocho (48) horas semanales, " +
                    "conforme a la legislación vigente. Los días de descanso semanal, feriados y vacaciones se " +
                    "regirán por la Ley General del Trabajo y sus decretos reglamentarios."
                ),
                (
                    "SEXTA — Obligaciones de las Partes",
                    "EL TRABAJADOR se obliga a cumplir las disposiciones del Reglamento Interno de Trabajo, " +
                    "guardar absoluta reserva sobre la información confidencial de EL EMPLEADOR y desempeñar " +
                    "sus funciones con diligencia y responsabilidad. EL EMPLEADOR se obliga a respetar los " +
                    "derechos laborales establecidos por ley."
                ),
                (
                    "SÉPTIMA — Legislación Aplicable",
                    "En todo lo no previsto por el presente contrato, las partes se someten a la Ley General " +
                    "del Trabajo, Decreto Supremo N° 23570 y demás disposiciones legales vigentes en el " +
                    "Estado Plurinacional de Bolivia."
                )
            };

            foreach (var (titulo, texto) in clausulas)
            {
                col.Item().PaddingBottom(12).Column(clausula =>
                {
                    clausula.Item().Text(titulo).Bold().FontSize(11);
                    clausula.Item().PaddingLeft(8).Text(texto).FontSize(10)
                        .LineHeight(1.5f).FontColor(Colors.Grey.Darken2);
                });
            }

            // Firmas
            col.Item().PaddingTop(40).Row(row =>
            {
                row.RelativeItem().Column(firma =>
                {
                    firma.Item().BorderBottom(1).BorderColor(Colors.Grey.Darken1).Width(160).Height(1);
                    firma.Item().PaddingTop(4).Text("ARCA LTDA.").Bold().FontSize(10);
                    firma.Item().Text("Representante Legal").FontSize(9).FontColor(Colors.Grey.Medium);
                });

                row.ConstantItem(40);

                row.RelativeItem().Column(firma =>
                {
                    firma.Item().BorderBottom(1).BorderColor(Colors.Grey.Darken1).Width(160).Height(1);
                    firma.Item().PaddingTop(4).Text(c.EmployeeName).Bold().FontSize(10);
                    firma.Item().Text(c.EmployeePosition).FontSize(9).FontColor(Colors.Grey.Medium);
                });
            });
        });
    }

    private static void ComposeFooter(IContainer container)
    {
        container.BorderTop(1).BorderColor(Colors.Grey.Lighten1).PaddingTop(6).Row(row =>
        {
            row.RelativeItem().Text($"Contrato generado el {DateTime.UtcNow:dd/MM/yyyy HH:mm} UTC")
                .FontSize(8).FontColor(Colors.Grey.Medium);
            row.ConstantItem(100).AlignRight()
                .Text(text =>
                {
                    text.Span("Pág. ").FontSize(8).FontColor(Colors.Grey.Medium);
                    text.CurrentPageNumber().FontSize(8).FontColor(Colors.Grey.Medium);
                    text.Span(" / ").FontSize(8).FontColor(Colors.Grey.Medium);
                    text.TotalPages().FontSize(8).FontColor(Colors.Grey.Medium);
                });
        });
    }
}
