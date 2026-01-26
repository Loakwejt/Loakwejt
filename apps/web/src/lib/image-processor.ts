import sharp from 'sharp';

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
}

export interface ProcessedImage {
  buffer: Buffer;
  metadata: ImageMetadata;
  thumbnailBuffer?: Buffer;
}

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

const DEFAULT_OPTIONS: ProcessingOptions = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 85,
  generateThumbnail: true,
  thumbnailSize: 300,
};

/**
 * Process an image: resize if needed, optimize, and optionally generate thumbnail
 */
export async function processImage(
  buffer: Buffer,
  mimeType: string,
  options: ProcessingOptions = {}
): Promise<ProcessedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check if it's an image we can process
  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (!supportedFormats.includes(mimeType)) {
    // Return original for unsupported formats
    const metadata = await sharp(buffer).metadata();
    return {
      buffer,
      metadata: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
      },
    };
  }

  let image = sharp(buffer);
  const metadata = await image.metadata();

  // Resize if larger than max dimensions
  if (
    (metadata.width && metadata.width > opts.maxWidth!) ||
    (metadata.height && metadata.height > opts.maxHeight!)
  ) {
    image = image.resize(opts.maxWidth, opts.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Optimize based on format
  let processedBuffer: Buffer;
  let outputFormat = metadata.format || 'jpeg';

  switch (mimeType) {
    case 'image/jpeg':
      processedBuffer = await image.jpeg({ quality: opts.quality }).toBuffer();
      outputFormat = 'jpeg';
      break;
    case 'image/png':
      processedBuffer = await image.png({ compressionLevel: 9 }).toBuffer();
      outputFormat = 'png';
      break;
    case 'image/webp':
      processedBuffer = await image.webp({ quality: opts.quality }).toBuffer();
      outputFormat = 'webp';
      break;
    case 'image/avif':
      processedBuffer = await image.avif({ quality: opts.quality }).toBuffer();
      outputFormat = 'avif';
      break;
    case 'image/gif':
      // GIFs are passed through (sharp has limited GIF support)
      processedBuffer = buffer;
      outputFormat = 'gif';
      break;
    default:
      processedBuffer = await image.jpeg({ quality: opts.quality }).toBuffer();
      outputFormat = 'jpeg';
  }

  // Get final metadata
  const finalMetadata = await sharp(processedBuffer).metadata();

  // Generate thumbnail if requested
  let thumbnailBuffer: Buffer | undefined;
  if (opts.generateThumbnail && mimeType !== 'image/gif') {
    thumbnailBuffer = await sharp(buffer)
      .resize(opts.thumbnailSize, opts.thumbnailSize, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  return {
    buffer: processedBuffer,
    metadata: {
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0,
      format: outputFormat,
    },
    thumbnailBuffer,
  };
}

/**
 * Check if a file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Get image dimensions without processing
 */
export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number } | null> {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch {
    return null;
  }
}
