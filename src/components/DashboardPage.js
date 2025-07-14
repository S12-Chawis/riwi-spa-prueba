// Componente principal del dashboard
import { AuthService } from "../services/auth.js"

export class DashboardPage {
  constructor() {
    this.authService = new AuthService()
    this.currentUser = this.authService.getCurrentUser()
    this.isAdmin = this.authService.isAdmin()
  }

  render() {
    const container = document.createElement("div")
    container.className = "dashboard-container"

    container.innerHTML = `
            <div class="dashboard-header">
                <h2>Panel de Usuarios</h2>
                ${this.isAdmin ? '<button id="add-user-btn" class="btn btn-primary">Agregar Usuario</button>' : ""}
            </div>
            
            <div class="users-table-container">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha de Registro</th>
                            ${this.isAdmin ? "<th>Acciones</th>" : ""}
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                        <!-- Los usuarios se cargan dinámicamente -->
                    </tbody>
                </table>
            </div>

            <!-- Modal para editar usuario (solo admin) -->
            ${this.isAdmin ? this.renderEditModal() : ""}
        `

    return container
  }

  renderEditModal() {
    return `
            <div id="edit-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Editar Usuario</h3>
                        <span class="close">&times;</span>
                    </div>
                    <form id="edit-user-form">
                        <input type="hidden" id="edit-user-id">
                        <div class="form-group">
                            <label for="edit-username">Usuario:</label>
                            <input type="text" id="edit-username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-email">Email:</label>
                            <input type="email" id="edit-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-role">Rol:</label>
                            <select id="edit-role" name="role">
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" id="cancel-edit">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        `
  }

  init() {
    this.loadUsers()
    this.setupEventListeners()
  }

  loadUsers() {
    const users = this.authService.getUsers()
    const tbody = document.getElementById("users-table-body")

    tbody.innerHTML = users
      .map(
        (user) => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge role-${user.role}">${user.role}</span>
                </td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                ${
                  this.isAdmin
                    ? `
                    <td class="actions">
                        <button class="btn btn-sm btn-secondary" onclick="dashboard.editUser(${user.id})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.deleteUser(${user.id})">
                            Eliminar
                        </button>
                    </td>
                `
                    : ""
                }
            </tr>
        `,
      )
      .join("")
  }

  setupEventListeners() {
    // Hacer la instancia accesible globalmente para los onclick
    window.dashboard = this

    if (this.isAdmin) {
      // Modal de edición
      const modal = document.getElementById("edit-modal")
      const closeBtn = modal.querySelector(".close")
      const cancelBtn = document.getElementById("cancel-edit")
      const editForm = document.getElementById("edit-user-form")

      closeBtn.addEventListener("click", () => this.closeModal())
      cancelBtn.addEventListener("click", () => this.closeModal())

      // Cerrar modal al hacer click fuera
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal()
        }
      })

      // Manejar envío del formulario de edición
      editForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleEditSubmit()
      })
    }
  }

  editUser(userId) {
    if (!this.isAdmin) return

    const users = this.authService.getUsers()
    const user = users.find((u) => u.id === userId)

    if (user) {
      document.getElementById("edit-user-id").value = user.id
      document.getElementById("edit-username").value = user.username
      document.getElementById("edit-email").value = user.email
      document.getElementById("edit-role").value = user.role

      document.getElementById("edit-modal").classList.remove("hidden")
    }
  }

  deleteUser(userId) {
    if (!this.isAdmin) return

    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      const result = this.authService.deleteUser(userId)

      if (result.success) {
        this.loadUsers() // Recargar la tabla
        alert(result.message)
      } else {
        alert(result.message)
      }
    }
  }

  handleEditSubmit() {
    const formData = new FormData(document.getElementById("edit-user-form"))
    const userId = Number.parseInt(formData.get("userId") || document.getElementById("edit-user-id").value)

    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      role: formData.get("role"),
    }

    const result = this.authService.updateUser(userId, userData)

    if (result.success) {
      this.closeModal()
      this.loadUsers() // Recargar la tabla
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  closeModal() {
    document.getElementById("edit-modal").classList.add("hidden")
  }
}
