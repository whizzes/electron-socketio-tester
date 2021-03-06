const { remote } = window.require('electron');

export type OpenSaveDialog = (title: string, defaultPath: string, filters?: any[]) =>
  Promise<string | null>;

export interface IDialogService {
  saveDialog: OpenSaveDialog;
}

class DialogService implements IDialogService {
  private readonly remote = remote

  constructor() {
    this.saveDialog = this.saveDialog.bind(this);
  }

  public async saveDialog(
    title: string,
    defaultPath: string,
    filters?: any[],
  ): Promise<string | null> {
    const { dialog } = this.remote;
    const window = this.remote.getCurrentWindow();

    const { filePath, canceled } = await dialog.showSaveDialog(window, {
      title,
      defaultPath,
      filters,
    });

    return canceled ? null : filePath;
  }
}

export default DialogService;
