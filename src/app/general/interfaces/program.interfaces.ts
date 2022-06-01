export enum VARIABLE_TYPE {
  integer = 'I',
  real = 'R',
  bool = 'L',
  chain = 'C',
}

export enum LINE_TYPE {
  new = 'nueva',
  label = 'etiqueta',
  load = 'cargue',
  store = 'almacene',
  read = 'lea',
  add = 'sume',
  subtract = 'reste',
  multiply = 'multiplique',
  division = 'divida',
  exponentiation = 'potencia',
  module = 'modulo',
  concatenate = 'concatene',
  delete = 'elimine',
  extract = 'extraiga',
  show = 'muestre',
  print = 'imprima',
  go = 'vaya',
  goIf = 'vayasi',
  return = 'retorne',
  AND = 'Y',
  OR = 'O',
  NOT = 'NO',
}

export interface Label {
  programID: string
  name: string
  programPosition: number
  memoryPosition: number | null
}

export interface Variable {
  programID: string
  name: string
  type: string
  value: number | string
  declarationOrder: number
  programPosition: number
  memoryPosition: number | null
}

export interface Program {
  id: string
  name: string
  length: number
  memoryBlock: Array<CompoundMemoryItem | string | number>
  variables: Map<string, Variable>
  labels: Map<string, Label>
  initialPosition: number | null
  lastPosition: number | null
  priority: number
  arrivalTime: number
  avalaibleBursts: number
  executionPosition: number
  executionCompleted: boolean
  savedAccumulator: number | string
}

export interface CodeError {
  programID: string
  line: number
  text: string
}

export interface CompoundMemoryItem {
  programID: string
  lineText: string
  lineType: LINE_TYPE
  varName?: string
  var1Name?: string
  var2Name?: string
  var3Name?: string
  labelName?: string
  label1Name?: string
  label2Name?: string
  labelValue?: number
  varValue?: number | string
  value?: string | number | null
  varType?: VARIABLE_TYPE
  programPosition?: number
  memoryPosition?: number | null
}

export interface Partition {
  initialPosition: number
  lastPosition: number
  size: number
  available: boolean
}
