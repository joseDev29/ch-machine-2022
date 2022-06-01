import { Component } from '@angular/core'
import { MessageService } from 'primeng/api'
import { of } from 'rxjs'
import { PROCESS_PLANNING_METHOD } from '../../interfaces/machine.interfaces'
import { Partition } from '../../interfaces/program.interfaces'
import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-machine-conditional-options-modal',
  templateUrl: 'machine-conditional-options-modal.component.html',
})
export class MachineConditionalOptionsModalComponent {
  public quantum: number = 0
  public newPartitionSize = 0

  constructor(
    public readonly machineState: MachineStateService,
    public readonly messageService: MessageService,
  ) {}

  onSave = () => {
    const avalaibleMemory = this.getAvalaibleMemory()

    if (avalaibleMemory) {
      this.newPartitionSize = avalaibleMemory
      this.createPartition()
    }

    this.machineState.setConditionalOptions({ quantum: this.quantum })
    this.machineState.machineConditionalOptionsModalState = {
      visible: false,
    }
  }

  getAvalaibleMemory = () => {
    let avalaibleMemory =
      this.machineState.memoryCount - 1 - this.machineState.kernelCount

    this.machineState.partitions.map((item) => (avalaibleMemory -= item.size))

    return avalaibleMemory
  }

  createPartition = () => {
    const avalaibleMemory = this.getAvalaibleMemory()

    const lastPartition =
      this.machineState.partitions[this.machineState.partitions.length - 1]

    this.machineState.partitions.push({
      available: true,
      size: this.newPartitionSize,
      initialPosition: lastPartition
        ? lastPartition.lastPosition + 1
        : this.machineState.memoryCount - avalaibleMemory,
      lastPosition: lastPartition
        ? lastPartition.lastPosition + this.newPartitionSize
        : this.machineState.memoryCount -
          avalaibleMemory +
          this.newPartitionSize -
          1,
    })
  }

  onCreatePartition = () => {
    const avalaibleMemory = this.getAvalaibleMemory()

    if (!this.newPartitionSize) {
      return this.messageService.add({
        severity: 'error',
        summary: 'El tamaño de la particion no puede ser cero',
      })
    }

    if (this.newPartitionSize > avalaibleMemory) {
      return this.messageService.add({
        severity: 'error',
        summary:
          'El tamaño de la particion sobrepasa la cantidad de memoria disponible',
      })
    }

    this.createPartition()

    this.messageService.add({
      severity: 'success',
      summary: 'La particion ha sido creada exitosamente',
    })
  }
}
