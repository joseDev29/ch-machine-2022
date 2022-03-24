import { VARIABLE_TYPE } from './program.interfaces'

export type MachineState = 'NO INICIADA' | 'KERNEL' | 'USUARIO'
export type ExecutionMode = 'not-pause' | 'step-by-step' | ''

export interface ButtonsState {
  initMachine: boolean
  resetMachine: boolean
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

export interface ReadOperationInput {
  active: boolean
  value: string
  memoryPosition: number
  varType: VARIABLE_TYPE
}
