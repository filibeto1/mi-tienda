/**
 * Comprime una imagen base64 reduciendo su tamaño
 * @param {string} base64 - Imagen en formato base64
 * @param {number} maxWidth - Ancho máximo (default: 800)
 * @param {number} quality - Calidad (0.1 a 1, default: 0.5)
 * @returns {Promise<string>} - Imagen comprimida en base64
 */
export const compressImage = (base64, maxWidth = 800, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Reducir dimensiones si es necesario
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Comprimir y convertir a JPEG (más pequeño que PNG)
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = reject;
  });
};

/**
 * Comprime un archivo de imagen directamente
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - Imagen comprimida en base64
 */
export const compressImageFile = async (file, maxWidth = 800, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const compressed = await compressImage(reader.result, maxWidth, quality);
        resolve(compressed);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
  });
};