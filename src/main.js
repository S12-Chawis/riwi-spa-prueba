// Punto de entrada principal de la aplicación
import { Router } from "./router.js"
import { AuthService } from "./services/auth.js"
import "./styles/main.css"

class App {
  constructor() {
    this.router = new Router()
    this.authService = new AuthService()
    this.init()
  }

  init() {
    // Inicializar la aplicación
    this.setupEventListeners()
    this.router.init()

    // Verificar si hay un usuario logueado al cargar la página
    if (this.authService.isAuthenticated()) {
      this.showNavbar()
    }
  }

  setupEventListeners() {
    // Event listener para el botón de logout
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this.authService.logout()
        this.hideNavbar()
        this.router.navigate("/login")
      })
    }

    // Event listeners para navegación
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault()
        const path = e.target.getAttribute("href")
        this.router.navigate(path)
      }
    })
  }

  showNavbar() {
    const navbar = document.getElementById("navbar")
    const userInfo = document.getElementById("user-info")
    const currentUser = this.authService.getCurrentUser()

    if (navbar && userInfo && currentUser) {
      navbar.classList.remove("hidden")
      userInfo.textContent = `Bienvenido, ${currentUser.username} (${currentUser.role})`
    }
  }

  hideNavbar() {
    const navbar = document.getElementById("navbar")
    if (navbar) {
      navbar.classList.add("hidden")
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new App()
})
