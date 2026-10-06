import { Download, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export function getArtifactDirectory(directory = 'data/files'): string {
  const artifactDirectory = path.resolve(process.cwd(), directory);
  fs.mkdirSync(artifactDirectory, { recursive: true });
  return artifactDirectory;
}

export async function saveDownloadedFile(
  page: Page,
  directory = 'data/files',
): Promise<string> {
  const download = await page.waitForEvent('download');
  return saveDownload(download, directory);
}

export async function saveDownload(
  download: Download,
  directory = 'data/files',
): Promise<string> {
  const filePath = path.join(getArtifactDirectory(directory), download.suggestedFilename());
  await download.saveAs(filePath);
  return filePath;
}

export function deleteFilesByExtension(
  directory: string,
  extension: string,
): void {
  if (!fs.existsSync(directory)) {
    return;
  }

  for (const entry of fs.readdirSync(directory)) {
    if (entry.toLowerCase().endsWith(extension.toLowerCase())) {
      fs.rmSync(path.join(directory, entry), { force: true });
    }
  }
}
