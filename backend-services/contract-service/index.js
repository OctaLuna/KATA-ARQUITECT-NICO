const express = require('express');
const pdf = require('html-pdf');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Plantilla HTML del contrato (Parametrizable)
const getHTMLTemplate = (data) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        /* Configuraciones de Página para PDF */
        @page { margin: 1.5cm; }
        body { 
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; 
            color: #1a1c29; 
            margin: 0;
            padding: 0;
            background-color: #f6f7f9; 
        }

        /* Estilo del Panel de Encabezado */
        .page-header {
            background-color: #ffffff; 
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
            margin-bottom: 30px;
        }

        /* INTEGRACIÓN DEL LOGO ESTILO REACT/LUCIDE */
        .logo-area {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .logo-container {
            float: left;
            background-color: #1a1c29; /* bg-primary */
            color: #ffffff; /* text-primary-foreground */
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            /* shadow-lg shadow-primary/20 simulado */
            box-shadow: 0 10px 15px -3px rgba(26, 28, 41, 0.2); 
        }
        .logo-container svg {
            width: 16px;
            height: 16px;
            margin: 8px; /* Centrado manual para el renderizado de PDF */
        }
        .app-title {
            float: left;
            font-size: 20px;
            font-weight: bold;
            color: #1a1c29;
            margin: 0;
            line-height: 32px; /* Alineado con la altura del logo */
        }
        .clear { clear: both; } 

        .contract-header-text {
            margin-top: 20px;
            text-align: center;
        }
        .main-title {
            font-size: 30px; 
            font-weight: bold;
            color: #1a1c29;
            margin: 10px 0;
        }
        .sub-title {
            font-size: 14px; 
            color: #71727c; 
            max-width: 600px;
            margin: 0 auto;
        }

        /* Estilo del Contenido Principal */
        .content {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            text-align: justify;
            font-size: 12pt;
            line-height: 1.6;
        }
        .section { margin-bottom: 25px; }
        .section-number {
            font-weight: bold;
            color: #1a1c29;
            text-transform: uppercase;
            font-size: 11pt;
            border-bottom: 1px solid #71727c;
            display: inline-block;
            margin-bottom: 10px;
        }

        /* Estilo de los 'Cards' para Datos Clave */
        .variable-card {
            background-color: #1a1c29; 
            color: #ffffff; 
            border-radius: 12px;
            padding: 15px;
            margin: 15px 0;
            display: block; /* Cambiado a block para mejor compatibilidad con generadores de PDF */
        }
        .variable-label {
            font-weight: normal;
            font-size: 10pt;
            display: block;
            margin-bottom: 5px;
            opacity: 0.8;
        }
        .variable-value {
            font-size: 18px;
            font-weight: bold;
            display: block;
        }

        /* Firmas */
        .signature-table { 
            width: 100%; 
            margin-top: 70px; 
            border-collapse: collapse;
        }
        .signature-cell {
            width: 50%;
            text-align: center;
            vertical-align: bottom;
            padding: 20px;
        }
        .signature-line { 
            border-top: 2px solid #1a1c29; 
            width: 200px; 
            margin: 0 auto 5px auto; 
        }
        .signature-label {
            color: #71727c;
            font-size: 10pt;
        }
    </style>
</head>
<body>

    <div class="page-header">
        <div class="logo-area">
            <div class="logo-container">
                <!-- SVG de Building2 (Lucide) -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
                    <path d="M9 22v-4h6v4"/>
                    <path d="M8 6h.01"/>
                    <path d="M16 6h.01"/>
                    <path d="M8 10h.01"/>
                    <path d="M16 10h.01"/>
                    <path d="M8 14h.01"/>
                    <path d="M16 14h.01"/>
                </svg>
            </div>
            <h1 class="app-title">ARCA</h1>
            <div class="clear"></div>
        </div>
        <div class="contract-header-text">
            <p class="main-title">Contrato Individual de Trabajo</p>
            <p class="sub-title">Formalización del ciclo de vida del personal con un sistema ágil y seguro.</p>
        </div>
    </div>

    <div class="content">
        <div class="section">
            <div class="section-number">PRIMERA: PARTES</div>
            <p>Se celebra el presente Contrato Individual de Trabajo entre la Empresa y el Funcionario, cuyos datos principales se detallan a continuación.</p>
        </div>

        <div class="section">
            <div class="section-number">SEGUNDA: CONDICIONES CLAVE</div>
            <p>Las partes acuerdan los términos laborales fundamentales:</p>
            
            <div class="variable-card">
                <span class="variable-label">Fecha de Ingreso</span>
                <span class="variable-value">${data.fecha_ingreso}</span>
            </div>
            
            <div class="variable-card">
                <span class="variable-label">Salario Mensual</span>
                <span class="variable-value">${data.salario}</span>
            </div>
            
            <div class="variable-card">
                <span class="variable-label">Periodo de Prueba</span>
                <span class="variable-value">${data.tiempo_prueba}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-number">TERCERA: CIERRE</div>
            <p>En conformidad con las leyes laborales vigentes, firman las partes:</p>
        </div>

        <table class="signature-table">
            <tr>
                <td class="signature-cell">
                    <div class="signature-line"></div>
                    <div class="signature-label">Por la Empresa</div>
                </td>
                <td class="signature-cell">
                    <div class="signature-line"></div>
                    <div class="signature-label">El Funcionario</div>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>
`;

// Endpoint Principal
app.post('/api/contracts/generate', (req, res) => {
    const { fecha_ingreso, salario, tiempo_prueba } = req.body;

    // Validación básica
    if (!fecha_ingreso || !salario || !tiempo_prueba) {
        return res.status(400).json({ error: 'Faltan datos requeridos en el JSON' });
    }

    const html = getHTMLTemplate(req.body);

    const options = { format: 'A4' };

    // Generar PDF y enviar como respuesta
    pdf.create(html, options).toStream((err, stream) => {
        if (err) return res.status(500).send(err);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=contrato.pdf');
        stream.pipe(res);
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Microservicio de Contratos en http://localhost:${PORT}`));