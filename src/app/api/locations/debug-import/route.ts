/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// Same CSV parser
function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      current.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (cell !== '' || current.length > 0) {
        current.push(cell);
        rows.push(current);
        current = [];
        cell = '';
      }
      if (char === '\r' && next === '\n') i++;
    } else {
      cell += char;
    }
  }

  if (cell !== '' || current.length > 0) {
    current.push(cell);
    rows.push(current);
  }

  return rows;
}

export async function GET() {
  try {
    // Load CSV
    const csvPath = path.join(process.cwd(), 'src', 'data', 'vietnam.csv');
    const content = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(content);

    const IDX_PARENT_CODE = 12;
    const IDX_WARD_NAME = 5;
    const IDX_CODE = 11;

    // Get unique parent codes
    const parentCodes = new Set<string>();
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length <= IDX_PARENT_CODE) continue;
      const parentCode = String(r[IDX_PARENT_CODE] || '').trim();
      if (parentCode) parentCodes.add(parentCode);
    }

    // Get provinces from DB
    const { data: provinces, error } = await supabase
      .from('provinces')
      .select('id, code');

    const dbCodes = (provinces || []).map((p: any) => p.code);

    // Sample first 5 wards
    const sampleWards = [];
    for (let i = 1; i < Math.min(6, rows.length); i++) {
      const r = rows[i];
      if (!r || r.length <= Math.max(IDX_PARENT_CODE, IDX_WARD_NAME)) continue;
      sampleWards.push({
        name: r[IDX_WARD_NAME],
        code: r[IDX_CODE],
        parent_code: r[IDX_PARENT_CODE]
      });
    }

    return NextResponse.json({
      totalRows: rows.length - 1, // exclude header
      uniqueParentCodes: Array.from(parentCodes).sort(),
      dbProvinceCodes: dbCodes.sort(),
      matchingCodes: Array.from(parentCodes).filter(c => dbCodes.includes(c)).sort(),
      sampleWards,
      error: error?.message || null
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
