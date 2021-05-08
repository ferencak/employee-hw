import React, { useState, useRef } from 'react'
import Form from '../form/Form'

import employeeStore from '../../../reducers/employeeStore'
import * as EmployeeActions from '../../../reducers/actions/employeeActions'
import { IRefObject } from '../../../interfaces/IRefObject'
import './style.css'

EmployeeActions.loadEmployees()

const List = (): JSX.Element => {
  const ref = useRef<IRefObject>(null)
  const [employeeList, setEmployeeList]: any = useState(employeeStore.list)
  const [sortBool, setSortBool]: any = useState(false) 

  employeeStore.on('change', (): void => {
    setEmployeeList([...employeeStore.list])
  })

  const sortList = (sortBy: String): void => {
    let sortedList: Array<any> = []
    switch (sortBy) {
      case 'FILTER_BY_ID':
        sortedList = [...employeeList].sort((a: any, b: any) => {
          return sortBool ? a.id - b.id : b.id - a.id
        })
        break
      case 'FILTER_BY_NAME':
        sortedList = [...employeeList].sort((a: any, b: any) => {
          const [aName, bName] = [a.name.toLowerCase(), b.name.toLowerCase()]
          /**
           * Sort method taken from SO
           * @link https://stackoverflow.com/a/25831948 
          */ 
          return sortBool ? (aName === bName ? 0 : aName < bName ? -1 : 1) : (bName === aName ? 0 : bName < aName ? -1 : 1)
        })
        break
      case 'FILTER_BY_AGE':
        sortedList = [...employeeList].sort((a: any, b: any) => {
          return sortBool ? a.age - b.age : b.age - a.age
        })
        break
      case 'FILTER_BY_LAST_UPDATE': 
        sortedList = [...employeeList].sort((a: any, b: any) => {
          const [aDate, bDate] = [new Date(a.updatedDate), new Date(b.updatedDate)]
          return sortBool ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime()
        })
        break
      case 'FILTER_BY_SEX_F':
        sortedList = [...employeeList].sort((a: any, b: any) => {
          return a.sex === b.sex ? 0 : a.sex < b.sex ? -1 : 1
        })
        break
      case 'FILTER_BY_SEX_M':
        const tempSortedList: Array<any> = [...employeeList].filter((object) => {
          return object.sex === 'M'
        })
        sortedList = tempSortedList
        employeeList.filter((object: any) => {
          return object.sex !== 'M' ? sortedList.push(object) : -1
        })
        console.log(sortedList)
        break
      case 'FILTER_BY_SEX_O':
        sortedList = [...employeeList].sort((a: any, b: any) => {
          return a.sex === b.sex ? 0 : a.sex > b.sex ? -1 : 1
        })
        break
      default: 
        throw new Error(`Failed to filter. Undeclared value ${sortBy}!`)
    }
    setEmployeeList(sortedList)
    setSortBool(!sortBool)
  }

  const edit = (id: Number): void => {
    if(!ref.current) return
    ref.current.toggleEdit(id)
  }

  const ListComponent = (): JSX.Element => {
    return (
      <table className='list'>
        <thead>
          <tr>
            <th className='th' onClick={ () => sortList('FILTER_BY_ID') }>#</th>
            <th className='th' onClick={ () => sortList('FILTER_BY_NAME') }>Name</th>
            <th className='th' onClick={ () => sortList('FILTER_BY_AGE') }>Age</th>
            <th className=''>Sex 
              <span className='label' onClick={ () => sortList('FILTER_BY_SEX_F') }>F</span> 
              <span className='label' onClick={ () => sortList('FILTER_BY_SEX_M') }>M</span> 
              <span className='label' onClick={ () => sortList('FILTER_BY_SEX_O') }>O</span>
            </th>
            <th className='th' onClick={ () => sortList('FILTER_BY_LAST_UPDATE') }>Last update</th>
            <th className='th' style={{ textAlign: 'center'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          { employeeList.map((employee: any) => (
            <tr className='employee' key={ employee.id }>
              <td>{ employee.id }</td>
              <td>{ employee.name }</td>
              <td>{ employee.age }</td>
              <td>{ employee.sex }</td>
              <td>{ employee.updatedDate }</td>
              <td className='actions' style={{ textAlign: 'center'}}>
                <span className='edit' onClick={ () => edit(employee.id) }>📃</span>
                <span className='remove' onClick={ () => EmployeeActions.removeEmployee(employee.id) }>❌</span>
              </td>
            </tr>
          ))}
          { employeeList.length === 0 &&
            <tr className='employee'>
              <td>&nbsp;</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td className='actions' style={{ textAlign: 'center'}}>
              </td>
            </tr>
          }
        </tbody>
      </table>
    )
  }
  
  return (
    <React.Fragment>
      <div className='list-wrapper'>
        <div className='title'>
          <h1>Employee List</h1>
          <p>Total Records ({ employeeList.length })</p>
        </div>
        <ListComponent />
      </div>
      <Form ref={ ref } />
    </React.Fragment>
  )
}

export default List