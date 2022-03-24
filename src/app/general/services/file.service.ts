import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MachineStateService } from './machine-state.service';

@Injectable()
export class FileService {
  constructor(
    private readonly machineState: MachineStateService,
    private readonly messageService: MessageService
  ) {}

  verifyAndLoad = ({ file, filePath }: { file: Blob; filePath: string }) => {
    const isValidExtension = this.verifyExtension(filePath);

    if (!isValidExtension)
      return this.messageService.add({
        severity: 'error',
        summary: 'Error al cargar el archivo',
        detail:
          'La extension del archivo no es valida, solo se aceptan archivos con extension .ch',
      });

    const fileName = this.getFileName(filePath);

    this.readCodeFromFile({ file, fileName });
  };

  getFileName = (filePath: string): string => {
    let fileName: any = filePath.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/);
    fileName = fileName[1];
    fileName = fileName?.slice(0, fileName.length - 3);

    return fileName;
  };

  verifyExtension = (filePath: string) => {
    const fileExt = filePath.substring(filePath.length - 3, filePath.length);

    if (fileExt === '.ch') return true;

    return false;
  };

  readCodeFromFile = ({ file, fileName }: { file: Blob; fileName: string }) => {
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onerror = () =>
      this.messageService.add({
        severity: 'error',
        summary: 'Error al leer el archivo',
      });

    reader.onloadend = (readerEv: ProgressEvent<FileReader>) => {
      const result = readerEv.target?.result;

      if (!result)
        return this.messageService.add({
          severity: 'error',
          summary: 'Error al leer el archivo',
        });

      this.machineState.fileName = fileName;
      this.machineState.rawCode = result as string;
    };
  };

  downloadCode = () => {
    const element = document.createElement('a');

    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(this.machineState.rawCode)
    );

    element.setAttribute('download', this.machineState.fileName + '.ch');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
}
