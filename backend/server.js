require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const PORT = process.env.PORT || 3000;

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token error' });
  const token = parts[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token invalid' });
    req.userId = decoded.id;
    next();
  });
}

/** Registro **/
app.post('/api/auth/register', async (req, res) => {
  try {
    // Aceptamos tanto "contraseña" (lo que envía tu frontend) como "contrasena"
    const { nombre, apellido, correo, perfil_id } = req.body;
    const contrasena = req.body.contraseña || req.body.contrasena;

    if (!correo || !contrasena) return res.status(400).json({ error: 'correo y contraseña son requeridos' });

    const existing = await prisma.user.findUnique({ where: { correo } });
    if (existing) return res.status(409).json({ error: 'El correo ya está registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(contrasena, salt);

    const user = await prisma.user.create({
      data: { nombre, apellido, correo, contrasena: hashed, perfil_id }
    });
    const { contrasena: _, ...safe } = user;
    res.json({  user: safe });
  } catch (err) {
    console.error('REGISTER ERROR', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/** Login **/
app.post('/api/auth/login', async (req, res) => {
  try {
    const correo = req.body.correo;
    const contrasenaEntrada = req.body.contraseña || req.body.contrasena;

    if (!correo || !contrasenaEntrada) return res.status(400).json({ error: 'correo y contraseña son requeridos' });

    const user = await prisma.user.findUnique({ where: { correo } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(contrasenaEntrada, user.contrasena);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '8h' });
    const { contrasena: _, ...safe } = user;
    res.json({ token, user: safe });
  } catch (err) {
    console.error('LOGIN ERROR', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/** Me (protegida) **/
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const { contrasena: _, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    console.error('ME ERROR', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(PORT, () => console.log(`Auth server listening on port ${PORT}`));
