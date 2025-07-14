// Servicio para manejo de eventos
import { DatabaseService } from "./database.js"
import { AuthService } from "./auth.js"

export class EventsService {
  constructor() {
    this.db = new DatabaseService()
    this.authService = new AuthService()
  }

  getEvents() {
    return this.db.getEvents()
  }

  getEventById(id) {
    return this.db.getEventById(id)
  }

  createEvent(eventData) {
    // Solo admin puede crear eventos
    if (!this.authService.isAdmin()) {
      return { success: false, message: "No tienes permisos para crear eventos" }
    }

    const currentUser = this.authService.getCurrentUser()
    const newEventData = {
      ...eventData,
      createdBy: currentUser.id,
    }

    const newEvent = this.db.addEvent(newEventData)
    return { success: true, event: newEvent, message: "Evento creado exitosamente" }
  }

  updateEvent(eventId, eventData) {
    // Solo admin puede actualizar eventos
    if (!this.authService.isAdmin()) {
      return { success: false, message: "No tienes permisos para editar eventos" }
    }

    const updatedEvent = this.db.updateEvent(eventId, eventData)
    if (updatedEvent) {
      return { success: true, event: updatedEvent, message: "Evento actualizado exitosamente" }
    }

    return { success: false, message: "Evento no encontrado" }
  }

  deleteEvent(eventId) {
    // Solo admin puede eliminar eventos
    if (!this.authService.isAdmin()) {
      return { success: false, message: "No tienes permisos para eliminar eventos" }
    }

    this.db.deleteEvent(eventId)
    return { success: true, message: "Evento eliminado exitosamente" }
  }

  joinEvent(eventId) {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      return { success: false, message: "Debes estar logueado para unirte a un evento" }
    }

    return this.db.joinEvent(eventId, currentUser.id)
  }

  leaveEvent(eventId) {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) {
      return { success: false, message: "Debes estar logueado para salir de un evento" }
    }

    return this.db.leaveEvent(eventId, currentUser.id)
  }

  isUserInEvent(eventId) {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) return false

    const event = this.db.getEventById(eventId)
    return event && event.attendees.includes(currentUser.id)
  }

  getUserEvents() {
    const currentUser = this.authService.getCurrentUser()
    if (!currentUser) return []

    const events = this.db.getEvents()
    return events.filter((event) => event.attendees.includes(currentUser.id))
  }
}
