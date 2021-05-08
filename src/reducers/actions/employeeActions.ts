import Dispatcher from "../dispatcher"
import axios from 'axios'

const loadEmployees = async (): Promise<any> => {
  const { data } = await axios.get('https://api.jsonbin.io/b/6093b65093e0ce40806d7bb6')
  if(data === null) throw new Error('[Actions] Failed to fetch data')
  Dispatcher.dispatch({
    type: 'SET_EMPLOYEE_LIST', 
    payload: {
      data
    }
  })
}

const addEmployee = (data: any): void => {
  Dispatcher.dispatch({
    type: 'ADD_EMPLOYEE',
    payload: {
      data
    }
  })
}

const removeEmployee = (id: Number): void => {
  Dispatcher.dispatch({
    type: 'REMOVE_EMPLOYEE', 
    payload: {
      id
    }
  })
}

const editEmployee = (data: any): void => {
  Dispatcher.dispatch({
    type: 'EDIT_EMPLOYEE',
    payload: {
      data
    }
  })
}

export { loadEmployees, addEmployee, removeEmployee, editEmployee }