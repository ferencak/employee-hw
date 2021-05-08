import { EventEmitter } from "events"

import Dispatcher from "./dispatcher"

interface EmployeeStore {
  _list: Array<any>
}

class EmployeeStore extends EventEmitter {
  
  constructor() {
    super()
    this._list = []
  }

  set(data: any): void {
    if(!data) return
    data.forEach((object: any, index: any) => object.id = index + 1)
    this._list = data
    this.emit('change')
  }

  get list(): Array<any> {
    return this._list
  }

  add(data: any): void {
    if(!data) return
    this._list.push({
      name: data.name,
      age: data.age, 
      sex: data.sex,
      updatedDate: new Date().toISOString(),
      id: this._list.length + 1
    })
    this.emit('change')
  }

  remove(id: Number): void {
    if(!id) return
    const object = this._list.map(item => item.id).indexOf(id)
    this._list.splice(object, 1)
    this.emit('change')
  }

  edit(data: any): void {
    if(!data) return
    this._list.map((object: any) => {
      if(object.id !== data.id) return object
      object.name = data.name
      object.sex = data.sex
      object.age = data.age
      return object
    })
    this.emit('change')
  }

  get(id: Number): void {
    return this._list.find(object => object.id === id)
  }

  actions(action: any): void {
    const { type, payload } = action
    switch (type) {
      case 'SET_EMPLOYEE_LIST':
        this.set(payload.data)
        break
      case 'ADD_EMPLOYEE':
        this.add(payload.data)
        break
      case 'REMOVE_EMPLOYEE': 
        this.remove(payload.id)
        break
      case 'EDIT_EMPLOYEE': 
        this.edit(payload.data)
        break
      default:
        throw new Error('[Store] Invalid action type!') 
    }
  }
}

const employeeStore = new EmployeeStore()
Dispatcher.register(employeeStore.actions.bind(employeeStore))

export default employeeStore
