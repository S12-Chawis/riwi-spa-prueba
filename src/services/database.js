// Servicio para simular una base de datos con db.json
export class DatabaseService {
  constructor() {
    this.dbKey = "spa_database"
    this.initializeDatabase()
  }

  async initializeDatabase() {
    // MODIFICAR AQUÍ: Cambiar los datos iniciales de la base de datos
    const existingDb = this.getDatabase()

    if (!existingDb || !existingDb.users || !existingDb.events) {
      const defaultDb = {
        users: [
          {
            id: 1,
            username: "admin",
            email: "admin@example.com",
            password: "admin123",
            role: "admin",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            username: "usuario1",
            email: "user1@example.com",
            password: "user123",
            role: "user",
            createdAt: new Date().toISOString(),
          },
        ],
        events: [
          {
            id: 1,
            name: "Conferencia de Tecnología 2024",
            description: "Una conferencia sobre las últimas tendencias en tecnología y desarrollo de software.",
            capacity: 100,
            currentAttendees: 1,
            attendees: [2], // IDs de usuarios que asisten
            createdBy: 1,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Workshop de JavaScript",
            description: "Taller práctico sobre JavaScript moderno y frameworks populares.",
            capacity: 30,
            currentAttendees: 0,
            attendees: [],
            createdBy: 1,
            createdAt: new Date().toISOString(),
          },
        ],
      }

      this.saveDatabase(defaultDb)
    }
  }

  getDatabase() {
    const dbStr = localStorage.getItem(this.dbKey)
    return dbStr ? JSON.parse(dbStr) : null
  }

  saveDatabase(db) {
    localStorage.setItem(this.dbKey, JSON.stringify(db))
  }

  // Métodos para usuarios
  getUsers() {
    const db = this.getDatabase()
    return db ? db.users : []
  }

  getUserById(id) {
    const users = this.getUsers()
    return users.find((user) => user.id === id)
  }

  addUser(userData) {
    const db = this.getDatabase()
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    }

    db.users.push(newUser)
    this.saveDatabase(db)
    return newUser
  }

  updateUser(id, userData) {
    const db = this.getDatabase()
    const userIndex = db.users.findIndex((user) => user.id === id)

    if (userIndex !== -1) {
      db.users[userIndex] = { ...db.users[userIndex], ...userData }
      this.saveDatabase(db)
      return db.users[userIndex]
    }
    return null
  }

  deleteUser(id) {
    const db = this.getDatabase()
    db.users = db.users.filter((user) => user.id !== id)
    this.saveDatabase(db)
    return true
  }

  // Métodos para eventos
  getEvents() {
    const db = this.getDatabase()
    return db ? db.events : []
  }

  getEventById(id) {
    const events = this.getEvents()
    return events.find((event) => event.id === id)
  }

  addEvent(eventData) {
    const db = this.getDatabase()
    const newEvent = {
      id: Date.now(),
      ...eventData,
      currentAttendees: 0,
      attendees: [],
      createdAt: new Date().toISOString(),
    }

    db.events.push(newEvent)
    this.saveDatabase(db)
    return newEvent
  }

  updateEvent(id, eventData) {
    const db = this.getDatabase()
    const eventIndex = db.events.findIndex((event) => event.id === id)

    if (eventIndex !== -1) {
      db.events[eventIndex] = { ...db.events[eventIndex], ...eventData }
      this.saveDatabase(db)
      return db.events[eventIndex]
    }
    return null
  }

  deleteEvent(id) {
    const db = this.getDatabase()
    db.events = db.events.filter((event) => event.id !== id)
    this.saveDatabase(db)
    return true
  }

  // Métodos para manejo de asistentes a eventos
  joinEvent(eventId, userId) {
    const db = this.getDatabase()
    const event = db.events.find((e) => e.id === eventId)

    if (event && event.currentAttendees < event.capacity && !event.attendees.includes(userId)) {
      event.attendees.push(userId)
      event.currentAttendees = event.attendees.length
      this.saveDatabase(db)
      return { success: true, message: "Te has unido al evento exitosamente" }
    }

    if (event && event.attendees.includes(userId)) {
      return { success: false, message: "Ya estás registrado en este evento" }
    }

    if (event && event.currentAttendees >= event.capacity) {
      return { success: false, message: "El evento está lleno" }
    }

    return { success: false, message: "Error al unirse al evento" }
  }

  leaveEvent(eventId, userId) {
    const db = this.getDatabase()
    const event = db.events.find((e) => e.id === eventId)

    if (event && event.attendees.includes(userId)) {
      event.attendees = event.attendees.filter((id) => id !== userId)
      event.currentAttendees = event.attendees.length
      this.saveDatabase(db)
      return { success: true, message: "Has salido del evento exitosamente" }
    }

    return { success: false, message: "No estás registrado en este evento" }
  }
}
