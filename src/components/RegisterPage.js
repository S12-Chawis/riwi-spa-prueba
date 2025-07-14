// Componente de página de registro
import { AuthService } from "../services/auth.js"

export class RegisterPage {
  constructor() {
    this.authService = new AuthService()
  }

  render() {
    const container = document.createElement("div")
    container.className = "auth-container"

    container.innerHTML = `
            <div class="auth-card">
                <h2>Registro de Usuario</h2>
                <form id="register-form" class="auth-form">
                    <div class="form-group">
                        <label for="reg-username">Usuario:</label>
                        <input type="text" id="reg-username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="reg-email">Email:</label>
                        <input type="email" id="reg-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="reg-password">Contraseña:</label>
                        <input type="password" id="reg-password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="reg-confirm-password">Confirmar Contraseña:</label>
                        <input type="password" id="reg-confirm-password" name="confirmPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Registrarse</button>
                    <div id="register-error" class="error-message hidden"></div>
                    <div id="register-success" class="success-message hidden"></div>
                </form>
                <p class="auth-link">
                    ¿Ya tienes cuenta? <a href="/login" data-link>Inicia sesión aquí</a>
                </p>
            </div>
        `

    return container
  }

  init() {
    const form = document.getElementById("register-form")
    const errorDiv = document.getElementById("register-error")
    const successDiv = document.getElementById("register-success")

    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const userData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      }
      const confirmPassword = formData.get("confirmPassword")

      // Validar que las contraseñas coincidan
      if (userData.password !== confirmPassword) {
        errorDiv.textContent = "Las contraseñas no coinciden"
        errorDiv.classList.remove("hidden")
        successDiv.classList.add("hidden")
        return
      }

      const result = this.authService.register(userData)

      if (result.success) {
        successDiv.textContent = result.message
        successDiv.classList.remove("hidden")
        errorDiv.classList.add("hidden")
        form.reset()

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.history.pushState({}, "", "/login")
          window.dispatchEvent(new PopStateEvent("popstate"))
        }, 2000)
      } else {
        errorDiv.textContent = result.message
        errorDiv.classList.remove("hidden")
        successDiv.classList.add("hidden")
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
