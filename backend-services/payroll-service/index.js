const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

// --- INFRASTRUCTURE (Database) ---
const db = new sqlite3.Database(path.resolve(__dirname, 'payroll.db'), (err) => {
    if (err) console.error('Error connecting to SQLite:', err.message);
    else {
        db.run(`CREATE TABLE IF NOT EXISTS HISTORICO_PAGOS (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            EmployeeId TEXT NOT NULL,
            EmployeeName TEXT NOT NULL,
            Period TEXT NOT NULL,
            BaseSalary REAL NOT NULL,
            Deductions REAL NOT NULL,
            NetPay REAL NOT NULL,
            PaymentDate TEXT NOT NULL
        )`);
    }
});

// --- APPLICATION / API ---
app.post('/api/payrolls', (req, res) => {
    const { employeeId, employeeName, period, baseSalary } = req.body;
    const deductions = baseSalary * 0.1271;
    const netPay = baseSalary - deductions;
    const paymentDate = new Date().toISOString();

    db.run(
        `INSERT INTO HISTORICO_PAGOS (EmployeeId, EmployeeName, Period, BaseSalary, Deductions, NetPay, PaymentDate) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [employeeId, employeeName, period, baseSalary, deductions, netPay, paymentDate],
        function (err) {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(201).json({
                success: true,
                data: { id: this.lastID, employeeId, employeeName, period, baseSalary, deductions, netPay, paymentDate }
            });
        }
    );
});

app.get('/api/payrolls', (req, res) => {
    db.all(`SELECT * FROM HISTORICO_PAGOS`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        const mapped = rows.map(r => ({
            id: r.Id,
            employeeId: r.EmployeeId,
            employeeName: r.EmployeeName,
            period: r.Period,
            baseSalary: r.BaseSalary,
            deductions: r.Deductions,
            netPay: r.NetPay,
            paymentDate: r.PaymentDate
        }));
        res.json({ success: true, data: mapped });
    });
});

app.listen(PORT, () => {
    console.log(`Node.js Payroll Service is running on port ${PORT}...`);
});
