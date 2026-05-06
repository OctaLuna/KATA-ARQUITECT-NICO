const express = require('express');
const cors = require('cors');

const app = express();

// Habilitar CORS para React
app.use(cors());
app.use(express.json());

// Endpoint que procesa la lógica de vacaciones
app.post('/api/vacations/calculate/:idFuncionario', (req, res) => {
    const idFuncionario = req.params.idFuncionario;
    const hireDate = req.query.hireDate;

    if (!hireDate) {
        return res.status(400).json({ error: "Falta la fecha de ingreso" });
    }

    const entryDate = new Date(hireDate);
    const now = new Date();

    // Calcular antigüedad exacta
    let years = now.getFullYear() - entryDate.getFullYear();
    const monthDiff = now.getMonth() - entryDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < entryDate.getDate())) {
        years--;
    }

    // Regla de Negocio: Si Antigüedad >= 1 año ENTONCES Saldo = 15 días
    if (years >= 1) {
        return res.json({ 
            log: "[SUCCESS] Guardado en BD",
            idFuncionario: idFuncionario, 
            diasAsignados: 15, 
            antiguedadAnios: years,
            estado: "Ratificado"
        });
    }
    
    return res.status(400).json({ error: "El funcionario no cumple el año de antigüedad." });
});

// Correr en el puerto 5002 para no chocar con tu amigo
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Building...`);
    console.log(`info: Now listening on: http://localhost:${PORT}`);
    console.log(`Application started. Press Ctrl+C to shut down.`);
});