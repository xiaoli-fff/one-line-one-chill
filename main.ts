// One Line, One Chill (Node 22, standard library only): writes a single
// sentence of horror, under 200 characters, to /output/entry.txt.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "At three in the morning the baby monitor crackled, and a voice exactly like mine whispered our daughter's name from her empty room down the hall.";

// Gate (competition.yaml): /output/entry.txt must be UTF-8 text of 1-200
// characters, not only whitespace, and a single line that is one sentence.
// validateEntry checks each of those items separately so a failure names
// the gate item that was missed instead of a bare character count.
function validateEntry(line: string, maxChars: number): string {
  if (line.trim().length === 0) {
    throw new Error('gate failed: entry must not be only whitespace');
  }
  if (line.includes('\n') || line.includes('\r')) {
    throw new Error('gate failed: entry must be exactly one line');
  }
  // One sentence: ends with a full stop and contains no other full stop.
  if (!line.endsWith('.') || line.slice(0, -1).includes('.')) {
    throw new Error("gate failed: entry must be exactly one sentence ending with '.'");
  }
  const entry = line + '\n';
  const chars = [...entry].length;
  if (chars < 1 || chars > maxChars) {
    throw new Error(`gate failed: entry must be 1-${maxChars} characters, got ${chars}`);
  }
  return entry;
}

const ENTRY = validateEntry(LINE, 200);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), ENTRY, 'utf8');
