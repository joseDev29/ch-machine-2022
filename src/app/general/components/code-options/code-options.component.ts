import { Component } from '@angular/core'
import { CodeService } from '../../services/code.service'
import { FileService } from '../../services/file.service'

import { MachineStateService } from '../../services/machine-state.service'

@Component({
  selector: 'app-code-options',
  templateUrl: 'code-options.component.html',
})
export class CodeOptionsComponent {
  constructor(
    public readonly machineState: MachineStateService,
    private readonly codeService: CodeService,
    private readonly fileService: FileService,
  ) {}

  onAnalyzeCode = () => this.codeService.analyzeAndLoad()

  onDownloadFile = () => this.fileService.downloadCode()

  onChangeFile = (ev: any) => {
    const filePath = ev.target.value
    const file = ev.target.files[0]

    if (!filePath || !file) return

    this.fileService.verifyAndLoad({ file, filePath })
  }
}
