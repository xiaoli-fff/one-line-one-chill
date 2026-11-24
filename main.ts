// One Line, One Chill (Node 22, standard library only): writes a single
// sentence of horror, under 200 characters, to /output/entry.txt.
//
// The entry itself is a fixed literal: exactly one sentence, one line,
// 145 code points. Nothing in this file is generated at run time — the
// program only validates the literal against the competition gates and
// writes it out, so the output is fully deterministic.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic: no network, no randomness, no time or environment input.
// Both runs write identical bytes.
//
// Validation is split into one small function per gate item, each named
// after the gate it enforces, so a failure message names exactly the gate
// item that was missed instead of a bare character count.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "At three in the morning the baby monitor crackled, and a voice exactly like mine whispered our daughter's name from her empty room down the hall.";

// Gate limits from the competition kit: the entry must be 1-200
// characters. The literal is 145 code points, well inside the budget.
const MAX_CHARS = 200;
const MIN_CHARS = 1;

// Gate: entry must not be only whitespace.
function checkNonEmpty(line: string): void {
  if (line.trim().length === 0) {
    throw new Error('gate failed: entry must not be only whitespace');
  }
}

// Gate: entry must be exactly one line — no line breaks at all.
function checkSingleLine(line: string): void {
  if (line.includes('\n') || line.includes('\r')) {
    throw new Error('gate failed: entry must be exactly one line');
  }
}

// Gate: entry must be exactly one sentence — it ends with a full stop
// and contains no other full stop before that final one.
function checkSingleSentence(line: string): void {
  if (!line.endsWith('.') || line.slice(0, -1).includes('.')) {
    throw new Error("gate failed: entry must be exactly one sentence ending with '.'");
  }
}

// Gate: entry must be within the character budget. The count is taken in
// code points (not UTF-16 code units) over the text as written to disk,
// which includes the single trailing newline.
function checkCharBudget(entry: string, minChars: number, maxChars: number): void {
  const chars = [...entry].length;
  if (chars < minChars || chars > maxChars) {
    throw new Error(`gate failed: entry must be ${minChars}-${maxChars} characters, got ${chars}`);
  }
}

// Run the gates in order, then append the single trailing newline that
// the written file carries. Each gate is checked by its own function so a
// failure names the exact gate item that was missed.
function buildEntry(line: string): string {
  checkNonEmpty(line);
  checkSingleLine(line);
  checkSingleSentence(line);
  const entry = line + '\n';
  checkCharBudget(entry, MIN_CHARS, MAX_CHARS);
  return entry;
}

const ENTRY = buildEntry(LINE);

// Write the validated entry. The output directory defaults to /output
// inside the grader's container and can be overridden for local runs.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.txt'), ENTRY, 'utf8');
