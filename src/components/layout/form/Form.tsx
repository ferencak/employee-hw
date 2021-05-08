import { forwardRef, Ref, useImperativeHandle, useState } from 'react'

import employeeStore from '../../../reducers/employeeStore'
import * as EmployeeActions from '../../../reducers/actions/employeeActions'
import { IRefObject } from '../../../interfaces/IRefObject'

import './style.css'

const Form = forwardRef((props: any, ref: Ref<IRefObject>): JSX.Element => {

  useImperativeHandle(ref, (): IRefObject => ({ toggleEdit }))

  const [message, setMessage]: any = useState('')
  const [messageType, setMessageType]: any = useState('')
  const [name, setName]: any = useState('')
  const [age, setAge]: any = useState(-1)
  const [sex, setSex]: any = useState('F')

  const [title, setTitle]: any = useState('Create')
  const [editObjId, setEditObjId]: any = useState(-1)

  const toggleEdit = (id: Number): void => {
    const object: any = employeeStore.get(id)
    setName(object.name)
    setAge(object.age)
    setSex(object.sex)
    setTitle('Update')
    setEditObjId(id)
  }

  const validateData = (): any => {
    if(name === null || age === null || sex === null) return [createMessage('Failed! You have to fill inputs...'), setMessageType('danger')]
    if(name.length < 2 || name.length > 10) return [createMessage('Failed! Input "name" must have 2-10 characters...'), setMessageType('danger')]
    if(/[^a-zA-Z]/.test(name)) return [createMessage('Failed! Input "name" must contains only characters!'), setMessageType('danger')]
    if(age < 0 || age > 129 || isNaN(age)) return [createMessage('Failed! Input "age" must be between 0-129.'), setMessageType('danger')]
    if(!['F', 'M', 'O'].includes(sex)) return [createMessage('Failed! Invalid "sex" value.'), setMessageType('danger')]
    return -1
  }

  const createMessage = (message: String): void => {
    setMessage(message)
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  const resetStates = (): void => {
    setTitle('Create')
    setName('')
    setAge(-1)
    setSex('F')
    setEditObjId(-1)
  }

  const updateRecord = (): any => {
    if(validateData() !== -1) return

    const findRecord: any = employeeStore.list.find(employee => employee.id === editObjId)
    if(!findRecord) return [createMessage('Failed! This record does not exists!'), setMessageType('danger')]

    EmployeeActions.editEmployee({name, age,sex, updatedDate: new Date().toISOString(), id: editObjId})
    resetStates()
    
    return [createMessage(`Success! Employee (#${editObjId}) was updated.`), setMessageType('success')]
  }

  const createRecord = (): any => {
    if(validateData() !== -1) return

    EmployeeActions.addEmployee({name, age, sex})
    resetStates()
    return [createMessage('Success! Employee was created.'), setMessageType('success')]
  }

  return (
    <div className='form-wrapper'>
      <h1>{ title } Record</h1>
      { message &&
          <div className={`alert alert-${messageType}`}>
            { message }
          </div>
        }
      <div className='inner'>
        <div className='input-group'>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Epsilon" value={ name } onChange={ (e) => setName(e.target.value) } />
        </div>
        <div className='input-group'>
          <label htmlFor="age">Age</label>
          <input id="age" name="age" type="number" placeholder="20" value={ age === -1 ? '' : age } onChange={ (e) => setAge(parseInt(e.target.value)) }/>
        </div>
        <div className='input-group'>
          <label htmlFor="sex">Sex</label>
          <select name="sex" onChange={ (e) => setSex(e.target.value) } value={ sex }>
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="O">Other</option>
          </select>
        </div>
      </div>
      <button className="button" onClick={ title === 'Create' ? createRecord : updateRecord }>{ title }</button>
        { editObjId !== -1 &&
          <button className="button danger" onClick={ () => resetStates() }>Cancel</button>
        }
    </div>
  )
})

export default Form