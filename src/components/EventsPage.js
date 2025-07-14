// Componente principal de eventos
import { EventsService } from "../services/events.js"
import { AuthService } from "../services/auth.js"

export class EventsPage {
  constructor() {
    this.eventsService = new EventsService()
    this.authService = new AuthService()
    this.currentUser = this.authService.getCurrentUser()
    this.isAdmin = this.authService.isAdmin()
  }

  render() {
    const container = document.createElement("div")
    container.className = "events-container"

    container.innerHTML = `
      <div class="events-header">
        <h2>Gestión de Eventos</h2>
        ${this.isAdmin ? '<button id="create-event-btn" class="btn btn-primary">Crear Evento</button>' : ""}
      </div>
      
      <div class="events-grid" id="events-grid">
        <!-- Los eventos se cargan dinámicamente -->
      </div>

      <!-- Modal para crear/editar evento (solo admin) -->
      ${this.isAdmin ? this.renderEventModal() : ""}
    `

    return container
  }

  renderEventModal() {
    return `
      <div id="event-modal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-title">Crear Evento</h3>
            <span class="close">&times;</span>
          </div>
          <form id="event-form">
            <input type="hidden" id="event-id">
            <div class="form-group">
              <label for="event-name">Nombre del Evento:</label>
              <input type="text" id="event-name" name="name" required>
            </div>
            <div class="form-group">
              <label for="event-description">Descripción:</label>
              <textarea id="event-description" name="description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label for="event-capacity">Capacidad:</label>
              <input type="number" id="event-capacity" name="capacity" min="1" required>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" id="cancel-event">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Evento</button>
            </div>
          </form>
        </div>
      </div>
    `
  }

  init() {
    this.loadEvents()
    this.setupEventListeners()
  }

  loadEvents() {
    const events = this.eventsService.getEvents()
    const eventsGrid = document.getElementById("events-grid")

    if (events.length === 0) {
      eventsGrid.innerHTML = '<p class="no-events">No hay eventos disponibles</p>'
      return
    }

    eventsGrid.innerHTML = events.map((event) => this.renderEventCard(event)).join("")
  }

  renderEventCard(event) {
    const isUserInEvent = this.eventsService.isUserInEvent(event.id)
    const availableSpots = event.capacity - event.currentAttendees
    const isFull = availableSpots <= 0

    return `
      <div class="event-card">
        <div class="event-header">
          <h3>${event.name}</h3>
          <div class="event-capacity">
            <span class="capacity-badge ${isFull ? "full" : "available"}">
              ${event.currentAttendees}/${event.capacity}
            </span>
          </div>
        </div>
        
        <p class="event-description">${event.description}</p>
        
        <div class="event-info">
          <small>Creado: ${new Date(event.createdAt).toLocaleDateString()}</small>
          <small>Disponibles: ${availableSpots} cupos</small>
        </div>
        
        <div class="event-actions">
          ${this.renderEventActions(event, isUserInEvent, isFull)}
        </div>
      </div>
    `
  }

  renderEventActions(event, isUserInEvent, isFull) {
    let actions = ""

    // Acciones para usuarios normales
    if (!this.isAdmin) {
      if (isUserInEvent) {
        actions += `<button class="btn btn-danger btn-sm" onclick="eventsPage.leaveEvent(${event.id})">Salir del Evento</button>`
      } else if (!isFull) {
        actions += `<button class="btn btn-primary btn-sm" onclick="eventsPage.joinEvent(${event.id})">Unirse al Evento</button>`
      } else {
        actions += `<button class="btn btn-secondary btn-sm" disabled>Evento Lleno</button>`
      }
    }

    // Acciones para admin
    if (this.isAdmin) {
      actions += `
        <button class="btn btn-sm btn-secondary" onclick="eventsPage.editEvent(${event.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="eventsPage.deleteEvent(${event.id})">Eliminar</button>
      `

      // Admin también puede unirse/salirse
      if (isUserInEvent) {
        actions += `<button class="btn btn-warning btn-sm" onclick="eventsPage.leaveEvent(${event.id})">Salir</button>`
      } else if (!isFull) {
        actions += `<button class="btn btn-success btn-sm" onclick="eventsPage.joinEvent(${event.id})">Unirse</button>`
      }
    }

    return actions
  }

  setupEventListeners() {
    // Hacer la instancia accesible globalmente
    window.eventsPage = this

    if (this.isAdmin) {
      // Botón crear evento
      const createBtn = document.getElementById("create-event-btn")
      if (createBtn) {
        createBtn.addEventListener("click", () => this.openCreateModal())
      }

      // Modal de eventos
      const modal = document.getElementById("event-modal")
      const closeBtn = modal.querySelector(".close")
      const cancelBtn = document.getElementById("cancel-event")
      const eventForm = document.getElementById("event-form")

      closeBtn.addEventListener("click", () => this.closeModal())
      cancelBtn.addEventListener("click", () => this.closeModal())

      // Cerrar modal al hacer click fuera
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal()
        }
      })

      // Manejar envío del formulario
      eventForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleEventSubmit()
      })
    }
  }

  // Métodos para admin
  openCreateModal() {
    document.getElementById("modal-title").textContent = "Crear Evento"
    document.getElementById("event-form").reset()
    document.getElementById("event-id").value = ""
    document.getElementById("event-modal").classList.remove("hidden")
  }

  editEvent(eventId) {
    if (!this.isAdmin) return

    const event = this.eventsService.getEventById(eventId)
    if (event) {
      document.getElementById("modal-title").textContent = "Editar Evento"
      document.getElementById("event-id").value = event.id
      document.getElementById("event-name").value = event.name
      document.getElementById("event-description").value = event.description
      document.getElementById("event-capacity").value = event.capacity
      document.getElementById("event-modal").classList.remove("hidden")
    }
  }

  deleteEvent(eventId) {
    if (!this.isAdmin) return

    if (confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      const result = this.eventsService.deleteEvent(eventId)

      if (result.success) {
        this.loadEvents()
        alert(result.message)
      } else {
        alert(result.message)
      }
    }
  }

  handleEventSubmit() {
    const formData = new FormData(document.getElementById("event-form"))
    const eventId = document.getElementById("event-id").value

    const eventData = {
      name: formData.get("name"),
      description: formData.get("description"),
      capacity: Number.parseInt(formData.get("capacity")),
    }

    let result
    if (eventId) {
      // Editar evento existente
      result = this.eventsService.updateEvent(Number.parseInt(eventId), eventData)
    } else {
      // Crear nuevo evento
      result = this.eventsService.createEvent(eventData)
    }

    if (result.success) {
      this.closeModal()
      this.loadEvents()
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  closeModal() {
    document.getElementById("event-modal").classList.add("hidden")
  }

  // Métodos para usuarios
  joinEvent(eventId) {
    const result = this.eventsService.joinEvent(eventId)

    if (result.success) {
      this.loadEvents() // Recargar eventos para actualizar contadores
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  leaveEvent(eventId) {
    if (confirm("¿Estás seguro de que quieres salir de este evento?")) {
      const result = this.eventsService.leaveEvent(eventId)

      if (result.success) {
        this.loadEvents() // Recargar eventos para actualizar contadores
        alert(result.message)
      } else {
        alert(result.message)
      }
    }
  }
}
