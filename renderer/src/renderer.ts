import { BrowserWindow } from '@electron/remote';

// Get the current window
const currentWindow = BrowserWindow.getFocusedWindow();

// Window control buttons
document.getElementById('minimize-button')?.addEventListener('click', () => {
    currentWindow?.minimize();
});

document.getElementById('maximize-button')?.addEventListener('click', () => {
    if (currentWindow?.isMaximized()) {
        currentWindow.unmaximize();
    } else {
        currentWindow?.maximize();
    }
});

document.getElementById('close-button')?.addEventListener('click', () => {
    currentWindow?.close();
}); 