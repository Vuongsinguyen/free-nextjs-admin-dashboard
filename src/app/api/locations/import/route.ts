/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

// Simple CSV parser that handles quotes and commas inside quotes
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
        i++; // skip escaped quote
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
      // consume potential \r\n pair
      if (char === '\r' && next === '\n') i++;
    } else {
      cell += char;
    }
  }

  // push last cell/row if any
  if (cell !== '' || current.length > 0) {
    current.push(cell);
    rows.push(current);
  }

  return rows;
}

function mapWardType(csvType: string): 'ward' | 'commune' | 'town' {
  const t = (csvType || '').toLowerCase().trim();
  if (t === 'phuong' || t === 'phường') return 'ward';
  if (t === 'xa' || t === 'xã') return 'commune';
  if (t.includes('thi') && t.includes('tran')) return 'town';
  return 'ward';
}

export async function POST(req: NextRequest) {
  try {
    // Optional: restrict to dev to avoid accidental runs in prod
    // if (process.env.NODE_ENV !== 'development') {
    //   return NextResponse.json({ error: 'Disabled in production' }, { status: 403 });
    // }

    // Try to get an authenticated client: prefer service role if configured, else forward user token
    let client = supabaseAdmin ?? null;

    if (!client) {
      const auth = req.headers.get('authorization') || req.headers.get('Authorization');
      const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) {
        return NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 });
      }
      // Create a client bound to the end-user token (so RLS role = authenticated)
      const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
      const { createClient } = await import('@supabase/supabase-js');
      client = createClient(supaUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
      }) as typeof supabase;
    }

    // Load CSV from repo
    const csvPath = path.join(process.cwd(), 'src', 'data', 'vietnam.csv');
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ error: 'CSV file not found', path: csvPath }, { status: 404 });
    }
    const content = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(content);
    if (rows.length < 2) {
      return NextResponse.json({ error: 'CSV appears empty' }, { status: 400 });
    }

  // We expect the following indices by observed header:
    // 0:id, 1:Tên tỉnh, 3:Loại (province type), 5:Tên xã phường, 6:Loại (ward type), 11:code, 12:parent_code
    const IDX_WARD_NAME = 5;
    const IDX_WARD_TYPE = 6;
    const IDX_CODE = 11;
    const IDX_PARENT_CODE = 12;

    // Fetch existing provinces to map parent_code -> province_id
    const { data: provinces, error: provErr } = await client
      .from('provinces')
      .select('id, code');
    if (provErr) {
      return NextResponse.json({ error: 'Failed to load provinces', details: provErr.message }, { status: 500 });
    }
    console.log('📍 Provinces from DB:', provinces?.length || 0);
    console.log('📍 Province codes:', provinces?.map((p: any) => p.code).join(', '));
  const codeToProvinceId = new Map<string, string>();
  (provinces || []).forEach((p: { id: string; code: string }) => codeToProvinceId.set(String(p.code), p.id));

    // Build ward payload, limited to parent_code present in provinces
    const wards: Array<{
      province_id: string;
      code: string;
      name: string;
      name_en: string;
      type: 'ward' | 'commune' | 'town';
      status: 'active' | 'inactive';
    }> = [];
    
    let totalRows = 0;
    let skippedNoParent = 0;
    let skippedNoData = 0;
    const uniqueParentCodes = new Set<string>();
    
    for (let i = 1; i < rows.length; i++) {
      totalRows++;
      const r = rows[i];
      if (!r || r.length <= Math.max(IDX_PARENT_CODE, IDX_WARD_NAME)) {
        skippedNoData++;
        continue;
      }
      const parentCode = String(r[IDX_PARENT_CODE] || '').trim();
      uniqueParentCodes.add(parentCode);
      const provinceId = codeToProvinceId.get(parentCode);
      if (!provinceId) {
        skippedNoParent++;
        if (skippedNoParent <= 3) {
          console.log(`⚠️  No province found for parent_code: "${parentCode}"`);
        }
        continue; // skip rows for provinces we didn't seed
      }

      const name = String(r[IDX_WARD_NAME] || '').trim();
      const type = mapWardType(String(r[IDX_WARD_TYPE] || ''));
      const code = String(r[IDX_CODE] || '').trim();
      if (!name || !code) continue;

      wards.push({
        province_id: provinceId,
        code,
        name,
        name_en: name, // fallback; could add transliteration later
        type,
        status: 'active'
      });
    }

    console.log('📊 CSV Processing Summary:');
    console.log(`  - Total CSV rows: ${totalRows}`);
    console.log(`  - Unique parent codes in CSV: ${uniqueParentCodes.size}`);
    console.log(`  - Skipped (no parent match): ${skippedNoParent}`);
    console.log(`  - Skipped (incomplete data): ${skippedNoData}`);
    console.log(`  - Valid wards to import: ${wards.length}`);

    if (wards.length === 0) {
      return NextResponse.json({ error: 'No wards matched existing provinces' }, { status: 400 });
    }

    // Upsert in batches to avoid payload limits
    const BATCH_SIZE = 800;
    let inserted = 0;
    console.log('📊 Total wards to import:', wards.length);
    for (let i = 0; i < wards.length; i += BATCH_SIZE) {
      const batch = wards.slice(i, i + BATCH_SIZE);
      console.log(`🔄 Batch ${Math.floor(i / BATCH_SIZE) + 1}: Processing ${batch.length} wards`);
      const fromWards = (client as any).from('wards');
      const { error: upErr, count } = await fromWards.upsert(batch as any, {
        onConflict: 'code',
        ignoreDuplicates: true,
        count: 'exact'
      });
      if (upErr) {
        console.error('❌ Upsert error:', upErr);
        return NextResponse.json({ error: 'Failed to upsert wards', details: upErr.message, at: i }, { status: 500 });
      }
      console.log(`✅ Batch inserted/updated: ${count || 0} records`);
      inserted += count || 0;
    }

    console.log('✨ Import complete! Total parsed:', wards.length, 'Total inserted:', inserted);
    return NextResponse.json({ ok: true, totalParsed: wards.length, inserted });
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', details: err?.message || String(err) }, { status: 500 });
  }
}
