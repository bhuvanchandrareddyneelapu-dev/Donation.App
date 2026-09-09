import api from '../services/api';

export const downloadAuthenticatedFile = async (url: string, defaultFilename: string) => {
  const response = await api.get(url, { responseType: 'blob' });
  const rawContentType = response.headers['content-type'];
  const contentType = typeof rawContentType === 'string' ? rawContentType : 'application/octet-stream';
  const blob = new Blob([response.data], { type: contentType });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = defaultFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
};
