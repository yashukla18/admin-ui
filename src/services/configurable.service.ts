import axios from 'axios';

export const uploadFileToS3 = (url: string, file: File) => {
  return axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
};
