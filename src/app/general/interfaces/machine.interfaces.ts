import { VARIABLE_TYPE } from './program.interfaces'

export type MachineState = 'NO INICIADA' | 'KERNEL' | 'USUARIO'
export type ExecutionMode = 'not-pause' | 'step-by-step' | ''

export interface ButtonsState {
  initMachine: boolean
  resetMachine: boolean
  memoryManagementMethod: boolean
  planningMethod: boolean
  kernel: boolean
  memory: boolean
  codeEditor: boolean
  uploadCode: boolean
  downloadCode: boolean
  analyzeCode: boolean
  runNotPause: boolean
  runStepByStep: boolean
  resetMemoryPosition: boolean
  nextInstruction: boolean
}

export interface ModalsState {
  programOptions: boolean
}

export interface ReadOperationInput {
  active: boolean
  value: string
  memoryPosition: number
  varType: VARIABLE_TYPE
}

export enum PROCESS_PLANNING_METHOD {
  fcfs = 'fcfs',
  roundRobin = 'roundRobin',
  sjf = 'sjf',
  sjfExpropiative = 'sjfExpropiative',
  priority = 'priority',
  priorityExpropiative = 'priorityExpropiative',
}

export enum MEMORY_MANAGEMENT_METHOD {
  fixedPartitions = 'fixedPartitions',
  variablePartitions = 'variablePartitions',
  pagination = 'pagination',
}

export interface ProcessPlanningMethodOption {
  value: PROCESS_PLANNING_METHOD
  name: string
}

export interface MemoryManagementMethodOption {
  value: MEMORY_MANAGEMENT_METHOD
  name: string
}

export interface ProgramOptionsModalState {
  visible: boolean
  programID: string
}

export interface MachineConditionalOptionsModalState {
  visible: boolean
}

export interface Log {
  time: number
  programID: string
  memoryPosition: number
  lineText: string
}
