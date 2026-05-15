export { default as Matrix } from "./Matrix.vue";

export type Frame = number[][];

export function emptyFrame(rows: number, cols: number): Frame {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
}

export function ensureFrameSize(frame: Frame, rows: number, cols: number): Frame {
    const result: Frame = [];

    for (let r = 0; r < rows; r++) {
        const row = frame[r] || [];

        result.push([]);
        for (let c = 0; c < cols; c++) {
            result[r][c] = row[c] ?? 0;
        }
    }

    return result;
}

export function vu(columns: number, levels: number[]): Frame {
    const rows = 7;
    const frame = emptyFrame(rows, columns);

    for (let col = 0; col < Math.min(columns, levels.length); col++) {
        const level = Math.max(0, Math.min(1, levels[col]));
        const height = Math.floor(level * rows);

        for (let row = 0; row < rows; row++) {
            const rowFromBottom = rows - 1 - row;

            if (rowFromBottom < height) {
                let brightness = 1;

                if (row < rows * 0.3) {
                    brightness = 1;
                } else if (row < rows * 0.6) {
                    brightness = 0.8;
                } else {
                    brightness = 0.6;
                }

                frame[row][col] = brightness;
            }
        }
    }

    return frame;
}
