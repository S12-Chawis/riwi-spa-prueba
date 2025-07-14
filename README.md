# Sistema de Autenticación SPA con Gestión de Eventos

A system of authentication and user manage of events build with **JavaScript Vanilla**, **Vite** and **SPA architecture (Single Page Application)**.

## Technologies used

- **Frontend:** JavaScript Vanilla

- **Vite**

- **Styles:** CSS with Variables 

- **LocalStorage**  (Simulate database)

- **Arquitectura:** SPA con routing manual

## 📦 How to run the code

npm install --save-dev vite

npm run dev

### Pre-requirements

- Node.js (versión 16 o superior)

- npm o pnpm

### Pasos de instalación


1. **Clone or download the proyect**

   ```bash
   git clone <url-del-repositorio>

   cd vanilla-spa-auth


   ```





2. **Instalar dependencias**


   ```bash


   npm install


   # o


   pnpm install


   ```





3. **Ejecutar en modo desarrollo**


   ```bash


   npm run dev


   # o


   pnpm dev


   ```





4. **Abrir en el navegador**


   - La aplicación se abrirá automáticamente en `http://localhost:3000`





### Build para producción





```bash


npm run build


npm run preview


```





## 🎯 Uso





### 👤 **Usuarios de Prueba**





La aplicación viene con usuarios predefinidos para testing:





| Usuario | Contraseña | Rol | Permisos |


|---------|------------|-----|----------|


| `admin` | `admin123` | Admin | Gestión completa de usuarios y eventos |


| `usuario1` | `user123` | Usuario | Ver usuarios, gestionar su participación en eventos |





### 🔑 **Flujo de Autenticación**





1. **Acceso inicial:** La aplicación redirige automáticamente al login


2. **Inicio de sesión:** Usar credenciales de prueba o registrar nuevo usuario


3. **Navegación:** Una vez autenticado, acceso a Dashboard y Eventos


4. **Cierre de sesión:** Botón disponible en la barra de navegación





### 📊 **Dashboard de Usuarios**





**Para Administradores:**


- Ver lista completa de usuarios


- Editar información de usuarios


- Eliminar usuarios


- Cambiar roles de usuario





**Para Usuarios Normales:**


- Ver lista de usuarios (solo lectura)


- Ver información básica de perfiles





### 🎪 **Gestión de Eventos**





**Para Administradores:**


- ➕ **Crear eventos:** Nombre, descripción, capacidad


- ✏️ **Editar eventos:** Modificar información existente


- 🗑️ **Eliminar eventos:** Remover eventos del sistema


- 👥 **Participar:** Unirse/salirse como cualquier usuario





**Para Usuarios Normales:**


- 👀 **Ver eventos:** Lista completa con información detallada


- ➕ **Unirse:** Registrarse en eventos con cupos disponibles


- ➖ **Salirse:** Cancelar participación en eventos


- 📊 **Estado:** Ver cupos disponibles y estado de participación





### 🎛 **Características de Eventos**





- **Control de Capacidad:** Los eventos tienen límite de participantes


- **Contador Automático:** Se actualiza en tiempo real


- **Validaciones:** No permite unirse a eventos llenos


- **Estado Visual:** Badges que indican disponibilidad


- **Confirmaciones:** Diálogos de confirmación para acciones importantes





## 📁 Estructura del Proyecto





```


vanilla-spa-auth/


├── 📄 package.json              # Dependencias y scripts


├── ⚙️ vite.config.js           # Configuración de Vite


├── 🌐 index.html               # Punto de entrada HTML


├── 📊 db.json                  # Base de datos simulada


└── src/


    ├── 🚀 main.js              # Punto de entrada de la aplicación


    ├── 🛣️ router.js            # Sistema de routing SPA


    ├── 📁 services/


    │   ├── 🔐 auth.js          # Servicio de autenticación


    │   ├── 💾 database.js      # Servicio de base de datos simulada


    │   └── 🎉 events.js        # Servicio de gestión de eventos


    ├── 📁 components/


    │   ├── 🔑 LoginPage.js     # Página de inicio de sesión


    │   ├── 📝 RegisterPage.js  # Página de registro
