# ruta-auth-backend

Backend de autenticación para TuraClean


## Pasos rápidos

1. ajusta .env`DATABASE_URL` (por ejemplo `mysql://root:1720@127.0.0.1:3306/rutalimpia_db`)
se debe crear una basededatos en heidi sql llamada rutalimpia_db
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Genera Prisma y ejecuta migración:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Levanta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

