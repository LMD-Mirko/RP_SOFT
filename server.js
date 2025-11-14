const path = require('path');

// AGENT IA - rutas explícitas seguras (añadir antes del router que maneja el dashboard)
const agentFolder = path.join(__dirname, 'agent_ia'); // ajusta si la carpeta tiene otro nombre
const express = require('express');
app.use('/agent', express.static(agentFolder));

app.get('/agent/admin', (req, res) => {
  return res.sendFile(path.join(agentFolder, 'admin', 'index.html'));
});
app.get('/agent/user', (req, res) => {
  return res.sendFile(path.join(agentFolder, 'user', 'index.html'));
});
// FIN AGENT IA