import { DatabaseService } from "./database.js"

export class AuthService {
  constructor() {
    this.storageKey = "spa_auth_user"
    this.db = new DatabaseService()
  }

  async login(username, password) {
    const users = this.db.getUsers()
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      // Guardar usuario actual (sin la contraseña)
      const userSession = { ...user }
      delete userSession.password
      localStorage.setItem(this.storageKey, JSON.stringify(userSession))
      return { success: true, user: userSession }
    }

    return { success: false, message: "Credenciales inválidas" }
  }

  register(userData) {
    const users = this.db.getUsers()

    // Verificar si el usuario ya existe
    if (users.find((u) => u.username === userData.username || u.email === userData.email)) {
      return { success: false, message: "Usuario o email ya existe" }
    }

    // Crear nuevo usuario
    const newUserData = {
      ...userData,
      role: "user", // Por defecto, nuevos usuarios son 'user'
    }

    this.db.addUser(newUserData)
    return { success: true, message: "Usuario registrado exitosamente" }
  }

  logout() {
    localStorage.removeItem(this.storageKey)
  }

  isAuthenticated() {
    return localStorage.getItem(this.storageKey) !== null
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.storageKey)
    return userStr ? JSON.parse(userStr) : null
  }

  isAdmin() {
    const user = this.getCurrentUser()
    return user && user.role === "admin"
  }

  getUsers() {
    return this.db.getUsers()
  }

  updateUser(userId, userData) {
    // Solo admin puede actualizar usuarios
    if (!this.isAdmin()) {
      return { success: false, message: "No tienes permisos para esta acción" }
    }

    const updatedUser = this.db.updateUser(userId, userData)
    if (updatedUser) {
      return { success: true, message: "Usuario actualizado exitosamente" }
    }

    return { success: false, message: "Usuario no encontrado" }
  }

  deleteUser(userId) {
    // Solo admin puede eliminar usuarios
    if (!this.isAdmin()) {
      return { success: false, message: "No tienes permisos para esta acción" }
    }

    this.db.deleteUser(userId)
    return { success: true, message: "Usuario eliminado exitosamente" }
  }
}
