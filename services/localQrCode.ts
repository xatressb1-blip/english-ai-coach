// Fix 41.1: dependency-free local QR generator for short classroom LAN URLs.
// It generates QR Code Model 2, Version 5, error-correction level L, byte mode.
// Version 5-L provides 108 data codewords, which is ample for the classroom join URLs.

const VERSION = 5;
const SIZE = 17 + VERSION * 4;
const DATA_CODEWORDS = 108;
const EC_CODEWORDS = 26;
const MAX_BYTE_LENGTH = 106;

type MatrixCell = boolean | null;

function appendBits(bits: boolean[], value: number, length: number) {
  for (let bit = length - 1; bit >= 0; bit -= 1) {
    bits.push(((value >>> bit) & 1) !== 0);
  }
}

function utf8Bytes(value: string): number[] {
  return Array.from(new TextEncoder().encode(value));
}

function makeDataCodewords(text: string): number[] {
  const bytes = utf8Bytes(text);
  if (bytes.length > MAX_BYTE_LENGTH) {
    throw new Error(`QR payload is too long (${bytes.length} bytes).`);
  }

  const bits: boolean[] = [];
  appendBits(bits, 0b0100, 4); // Byte mode.
  appendBits(bits, bytes.length, 8); // Version 1-9 byte-mode character count.
  bytes.forEach((byte) => appendBits(bits, byte, 8));

  const capacityBits = DATA_CODEWORDS * 8;
  for (let index = 0; index < 4 && bits.length < capacityBits; index += 1) {
    bits.push(false);
  }
  while (bits.length % 8 !== 0) bits.push(false);

  const codewords: number[] = [];
  for (let index = 0; index < bits.length; index += 8) {
    let value = 0;
    for (let offset = 0; offset < 8; offset += 1) {
      value = (value << 1) | (bits[index + offset] ? 1 : 0);
    }
    codewords.push(value);
  }

  let useFirstPad = true;
  while (codewords.length < DATA_CODEWORDS) {
    codewords.push(useFirstPad ? 0xec : 0x11);
    useFirstPad = !useFirstPad;
  }
  return codewords;
}

const GF_EXP = new Array<number>(512).fill(0);
const GF_LOG = new Array<number>(256).fill(0);

(function initializeGaloisField() {
  let value = 1;
  for (let index = 0; index < 255; index += 1) {
    GF_EXP[index] = value;
    GF_LOG[value] = index;
    value <<= 1;
    if (value & 0x100) value ^= 0x11d;
  }
  for (let index = 255; index < 512; index += 1) {
    GF_EXP[index] = GF_EXP[index - 255];
  }
})();

function gfMultiply(left: number, right: number): number {
  if (left === 0 || right === 0) return 0;
  return GF_EXP[GF_LOG[left] + GF_LOG[right]];
}

function polynomialMultiply(left: number[], right: number[]): number[] {
  const result = new Array<number>(left.length + right.length - 1).fill(0);
  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      result[leftIndex + rightIndex] ^= gfMultiply(left[leftIndex], right[rightIndex]);
    }
  }
  return result;
}

function reedSolomonGenerator(degree: number): number[] {
  let generator = [1];
  for (let index = 0; index < degree; index += 1) {
    generator = polynomialMultiply(generator, [1, GF_EXP[index]]);
  }
  return generator;
}

function makeErrorCorrectionCodewords(data: number[]): number[] {
  const generator = reedSolomonGenerator(EC_CODEWORDS);
  const working = [...data, ...new Array<number>(EC_CODEWORDS).fill(0)];

  for (let index = 0; index < data.length; index += 1) {
    const factor = working[index];
    if (factor === 0) continue;
    for (let offset = 0; offset < generator.length; offset += 1) {
      working[index + offset] ^= gfMultiply(generator[offset], factor);
    }
  }

  return working.slice(data.length);
}

function bitLength(value: number): number {
  let working = value;
  let length = 0;
  while (working !== 0) {
    length += 1;
    working >>>= 1;
  }
  return length;
}

function makeFormatBits(maskPattern: number): number {
  // Error-correction level L has binary value 01 in the five format data bits.
  const formatData = (1 << 3) | maskPattern;
  const generator = 0x537;
  let remainder = formatData << 10;
  while (bitLength(remainder) - bitLength(generator) >= 0) {
    remainder ^= generator << (bitLength(remainder) - bitLength(generator));
  }
  return ((formatData << 10) | remainder) ^ 0x5412;
}

function maskApplies(maskPattern: number, row: number, column: number): boolean {
  switch (maskPattern) {
    case 0:
      return (row + column) % 2 === 0;
    case 1:
      return row % 2 === 0;
    case 2:
      return column % 3 === 0;
    case 3:
      return (row + column) % 3 === 0;
    case 4:
      return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
    case 5:
      return (row * column) % 2 + (row * column) % 3 === 0;
    case 6:
      return ((row * column) % 2 + (row * column) % 3) % 2 === 0;
    case 7:
      return ((row * column) % 3 + (row + column) % 2) % 2 === 0;
    default:
      return false;
  }
}

function placeFinder(matrix: MatrixCell[][], row: number, column: number) {
  for (let rowOffset = -1; rowOffset <= 7; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 7; columnOffset += 1) {
      const targetRow = row + rowOffset;
      const targetColumn = column + columnOffset;
      if (targetRow < 0 || targetColumn < 0 || targetRow >= SIZE || targetColumn >= SIZE) continue;

      const finderPixel =
        (rowOffset >= 0 && rowOffset <= 6 && (columnOffset === 0 || columnOffset === 6)) ||
        (columnOffset >= 0 && columnOffset <= 6 && (rowOffset === 0 || rowOffset === 6)) ||
        (rowOffset >= 2 && rowOffset <= 4 && columnOffset >= 2 && columnOffset <= 4);
      matrix[targetRow][targetColumn] = finderPixel;
    }
  }
}

function placeAlignment(matrix: MatrixCell[][], centerRow: number, centerColumn: number) {
  if (matrix[centerRow][centerColumn] !== null) return;
  for (let rowOffset = -2; rowOffset <= 2; rowOffset += 1) {
    for (let columnOffset = -2; columnOffset <= 2; columnOffset += 1) {
      matrix[centerRow + rowOffset][centerColumn + columnOffset] =
        Math.abs(rowOffset) === 2 ||
        Math.abs(columnOffset) === 2 ||
        (rowOffset === 0 && columnOffset === 0);
    }
  }
}

function placeFormatInfo(matrix: MatrixCell[][], maskPattern: number) {
  const bits = makeFormatBits(maskPattern);
  for (let index = 0; index < 15; index += 1) {
    const dark = ((bits >> index) & 1) !== 0;

    if (index < 6) matrix[index][8] = dark;
    else if (index < 8) matrix[index + 1][8] = dark;
    else matrix[SIZE - 15 + index][8] = dark;

    if (index < 8) matrix[8][SIZE - index - 1] = dark;
    else if (index < 9) matrix[8][15 - index] = dark;
    else matrix[8][14 - index] = dark;
  }

  // Fixed dark module for all QR codes.
  matrix[SIZE - 8][8] = true;
}

export function createLocalQrMatrix(text: string): boolean[][] {
  const maskPattern = 0;
  const matrix: MatrixCell[][] = Array.from({ length: SIZE }, () =>
    new Array<MatrixCell>(SIZE).fill(null),
  );

  placeFinder(matrix, 0, 0);
  placeFinder(matrix, SIZE - 7, 0);
  placeFinder(matrix, 0, SIZE - 7);

  // Version 5 alignment pattern centers are 6 and 30. The three positions near
  // finder patterns are already occupied, so only the bottom-right one is placed.
  [6, 30].forEach((row) => {
    [6, 30].forEach((column) => placeAlignment(matrix, row, column));
  });

  for (let row = 8; row < SIZE - 8; row += 1) {
    if (matrix[row][6] === null) matrix[row][6] = row % 2 === 0;
  }
  for (let column = 8; column < SIZE - 8; column += 1) {
    if (matrix[6][column] === null) matrix[6][column] = column % 2 === 0;
  }

  placeFormatInfo(matrix, maskPattern);

  const data = makeDataCodewords(text);
  const codewords = [...data, ...makeErrorCorrectionCodewords(data)];
  let row = SIZE - 1;
  let direction = -1;
  let byteIndex = 0;
  let bitIndex = 7;

  for (let column = SIZE - 1; column > 0; column -= 2) {
    if (column === 6) column -= 1;

    while (true) {
      for (let offset = 0; offset < 2; offset += 1) {
        const targetColumn = column - offset;
        if (matrix[row][targetColumn] !== null) continue;

        let dark = false;
        if (byteIndex < codewords.length) {
          dark = ((codewords[byteIndex] >>> bitIndex) & 1) !== 0;
        }
        if (maskApplies(maskPattern, row, targetColumn)) dark = !dark;
        matrix[row][targetColumn] = dark;

        bitIndex -= 1;
        if (bitIndex < 0) {
          byteIndex += 1;
          bitIndex = 7;
        }
      }

      row += direction;
      if (row < 0 || row >= SIZE) {
        row -= direction;
        direction = -direction;
        break;
      }
    }
  }

  return matrix.map((matrixRow) => matrixRow.map((cell) => cell === true));
}

export const LOCAL_QR_SIZE = SIZE;
