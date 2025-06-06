import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

// 🔧 Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🛠️ Middleware de debug para todas las peticiones
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  console.log('Body:', req.body);
  console.log('Params:', req.params);
  next();
});

// 📦 RUTAS IMPORTADAS
import propertiesRoutes from './routes/propertiesRoutes';
import authRoutes from './routes/authRoutes';
import login from './routes/login';
import register from './routes/register';
import realEstateRoutes from './routes/realEstateRoutes';
import adminRoutes from './routes/adminRoutes';
import invitacionRoutes from './routes/invitacionRoutes';
import passwordRoutes from './routes/passwordRoutes';
import registroRoutes from './routes/confirmacionRoutes';
import rolesRoutes from './routes/roles';
import agendaRoutes from './routes/Agenda';
import iaRoute from './routes/iaRoutes';
import searchRoutes from './routes/searchProperty';
import busquedaRoutes from './routes/searchProperty'; // Repetida pero mantenida por si alguna usa prefijo distinto

// ✅ Prefijo consistente para rutas API
app.use('/api/properties', propertiesRoutes);
app.use('/api/inmobiliarias', realEstateRoutes);   // ← Aquí montamos las rutas de inmobiliarias
app.use('/api/admin', adminRoutes);
app.use('/api/invitacion', invitacionRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/registro', registroRoutes);
app.use('/api/auth', authRoutes);

// 🔐 Autenticación y registro
app.use('/login', login);
app.use('/register', register);

// 🔍 Otras rutas sin prefijo
app.use('/roles', rolesRoutes);
app.use('/agenda', agendaRoutes);
app.use('/ia', iaRoute);
app.use('/busqueda', busquedaRoutes);
app.use('/search', searchRoutes);

// ✅ Ruta base de salud
app.get('/', (_req, res) => {
  res.json({
    message: 'DomuHouse API funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'online',
    iaIntegration: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
  });
});

// 🔍 Ruta de prueba
app.get('/test', (_req, res) => {
  res.json({ message: 'Server is working!' });
});

// ⚠️ Verificación de claves importantes
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ ADVERTENCIA: No se ha definido GEMINI_API_KEY en las variables de entorno');
  console.warn('Las funcionalidades de IA no funcionarán correctamente');
}

// ❌ Rutas no encontradas
app.use('*', (req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
  });
});

// ❌ Manejo global de errores
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Error global:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}`);
  console.log(`🏠 Properties Endpoint: http://localhost:${PORT}/api/properties`);
  console.log(`🏠 Real Estate Endpoint: http://localhost:${PORT}/api/inmobiliarias`); // Confirmamos el endpoint aquí
  console.log(`🤖 IA Endpoint: http://localhost:${PORT}/ia`);
});

export default app;
