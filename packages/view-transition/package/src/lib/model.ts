export interface RunOptions {
  debugName?: string;
  debugData?: unknown;
}

export type Callback<T = unknown> = () => T;

export type TransitionActiveElementId = string | number | null;
