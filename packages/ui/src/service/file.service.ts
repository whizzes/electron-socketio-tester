import { IPCEvents, DownloadFileParams } from 'shared';

const electron = window.require('electron');

export interface IFileService {
  create: (props: DownloadFileParams) => void;
}

class FileService implements IFileService {
  private readonly electron = electron

  constructor() {
    this.create = this.create.bind(this);
  }

  public create({ filename, contents }: DownloadFileParams): void {
    this.electron.ipcRenderer.send(IPCEvents.CREATE_AND_DOWNLOAD_FILE, {
      filename,
      contents,
    });
  }
}

export default FileService;
