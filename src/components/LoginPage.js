// Componente de página de login
import { AuthService } from "../services/auth.js"

export class LoginPage {
  constructor() {
    this.authService = new AuthService()
  }

  render() {
    const container = document.createElement("div")
    container.className = "auth-container"

    container.innerHTML = `
            <div class="auth-card">
                <h2>Iniciar Sesión</h2>
                <form id="login-form" class="auth-form">
                    <div class="form-group">
                        <label for="username">Usuario:</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Contraseña:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                    <div id="login-error" class="error-message hidden"></div>
                </form>
                <p class="auth-link">
                    ¿No tienes cuenta? <a href="/register" data-link>Regístrate aquí</a>
                </p>
                
                <!-- MODIFICAR AQUÍ: Información de usuarios de prueba -->
                <div class="demo-info">
                    <h4>Usuarios de prueba:</h4>
                    <p><strong>Admin:</strong> admin / admin123</p>
                    <p><strong>Usuario:</strong> usuario1 / user123</p>
                </div>
            </div>
        `

    return container
  }

  init() {
    const form = document.getElementById("login-form")
    const errorDiv = document.getElementById("login-error")

    // Manejar envío del formulario
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const username = formData.get("username")
      const password = formData.get("password")

      const result = this.authService.login(username, password)

      if (result.success) {
        // Recargar la página para actualizar el navbar
        window.location.reload()
      } else {
        errorDiv.textContent = result.message
        errorDiv.classList.remove("hidden")
      }
    })

    // Manejar enlaces de navegación
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault()
        const path = e.target.getAttribute("href")
        window.history.pushState({}, "", path)
        window.dispatchEvent(new PopStateEvent("popstate"))
      }
    })
  }
}
