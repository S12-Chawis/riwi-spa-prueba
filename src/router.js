// Sistema de routing para SPA
import { AuthService } from "./services/auth.js"
import { LoginPage } from "./components/LoginPage.js"
import { RegisterPage } from "./components/RegisterPage.js"
import { DashboardPage } from "./components/DashboardPage.js"
import { EventsPage } from "./components/EventsPage.js"

export class Router {
  constructor() {
    this.authService = new AuthService()
    this.routes = {
      "/": DashboardPage,
      "/login": LoginPage,
      "/register": RegisterPage,
      "/dashboard": DashboardPage,
      "/events": EventsPage,
    }
    this.currentRoute = null
  }

  init() {
    // Configurar el routing inicial
    window.addEventListener("popstate", () => this.handleRoute())
    this.handleRoute()
  }

  navigate(path) {
    // Navegar a una nueva ruta
    window.history.pushState({}, "", path)
    this.handleRoute()
  }

  handleRoute() {
    const path = window.location.pathname
    const isAuthenticated = this.authService.isAuthenticated()

    // MODIFICAR AQUÍ: Agregar nuevas rutas protegidas
    const protectedRoutes = ["/", "/dashboard", "/events"]
    const publicRoutes = ["/login", "/register"]

    // Redirigir si no está autenticado y trata de acceder a ruta protegida
    if (!isAuthenticated && protectedRoutes.includes(path)) {
      this.navigate("/login")
      return
    }

    // Redirigir al dashboard si está autenticado y trata de acceder a login/register
    if (isAuthenticated && publicRoutes.includes(path)) {
      this.navigate("/dashboard")
      return
    }

    // Renderizar la página correspondiente
    const PageComponent = this.routes[path] || this.routes["/dashboard"]
    if (PageComponent) {
      this.renderPage(PageComponent)
    }
  }

  renderPage(PageComponent) {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      // Limpiar contenido anterior
      mainContent.innerHTML = ""

      // Crear nueva instancia de la página
      const page = new PageComponent()
      const pageElement = page.render()

      // Agregar al DOM
      mainContent.appendChild(pageElement)

      // Inicializar eventos de la página
      if (page.init) {
        page.init()
      }
    }
  }
}
