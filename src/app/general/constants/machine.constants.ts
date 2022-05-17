import { PROCESS_PLANNING_METHOD } from '../interfaces/machine.interfaces'

export const MEMORY_LINE_SEPARATOR = '**/MEMORY_SEPARATOR/**'
export const NOT_ASSIGNED_CELL = 'No Asignada'

export const PROCESS_PLANNING_METHODS_OPTIONS = {
  fcfs: { value: PROCESS_PLANNING_METHOD.fcfs, name: 'FCFS' },
  roundRobin: {
    value: PROCESS_PLANNING_METHOD.roundRobin,
    name: 'Round robin',
  },
  sjf: { value: PROCESS_PLANNING_METHOD.sjf, name: 'SJF' },
  sjfExpropiative: {
    value: PROCESS_PLANNING_METHOD.sjfExpropiative,
    name: 'SJF (Expropiative)',
  },
  priority: { value: PROCESS_PLANNING_METHOD.priority, name: 'Priority' },
  priorityExpropiative: {
    value: PROCESS_PLANNING_METHOD.priorityExpropiative,
    name: 'Priority (Expropiative)',
  },
}
