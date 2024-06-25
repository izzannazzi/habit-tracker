// Fungsi untuk menghilangkan 'auth/' dari kode error
export const formattedErrorCode = (errorMessage) => {
  const prefix = "auth/";
  if (errorMessage.startsWith(prefix)) {
    return errorMessage.substring(prefix.length);
  }
  // Jika tidak dimulai dengan 'auth/', kembalikan errorMessage asli
  return errorMessage;
};
