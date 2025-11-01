'use client';

import { useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';

interface SeedResult {
  name: string;
  success: boolean;
  count?: number;
  error?: string;
}

export default function BuildingSetupPage() {
  const [seeding, setSeeding] = useState(false);
  const [results, setResults] = useState<SeedResult[]>([]);
  const [message, setMessage] = useState('');

  const handleMasterSeed = async () => {
    setSeeding(true);
    setResults([]);
    setMessage('');

    try {
      const response = await fetch('/api/building-management/seed-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
        setMessage(data.message || 'Seeding completed!');
      } else {
        setMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleIndividualSeed = async (endpoint: string, name: string) => {
    setSeeding(true);
    setMessage('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${name}: ${data.count} records seeded successfully`);
        setResults((prev) => [
          ...prev,
          { name, success: true, count: data.count }
        ]);
      } else {
        setMessage(`❌ ${name}: ${data.error || 'Unknown error'}`);
        setResults((prev) => [
          ...prev,
          { name, success: false, error: data.error }
        ]);
      }
    } catch (error) {
      setMessage(`❌ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Building Management Setup
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Initialize database with building hierarchy data
          </p>
        </div>
      </div>

      {/* Master Seed Section */}
      <ComponentCard title="🚀 Master Seed (Recommended)">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Seeds all tables in correct order: Building Categories → Properties → Zones → Buildings → Floors → Property Units
          </p>
          
          <button
            onClick={handleMasterSeed}
            disabled={seeding}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {seeding ? '⏳ Seeding...' : '🌱 Seed All Tables'}
          </button>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('Error') || message.includes('❌')
                ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
            }`}>
              {message}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">Results:</h3>
              <div className="space-y-1">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      result.success
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {result.success ? '✅' : '❌'} {result.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {result.success ? `${result.count} records` : result.error}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ComponentCard>

      {/* Individual Seeds Section */}
      <ComponentCard title="📦 Individual Seeds">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Seed tables individually (must follow the order below):
          </p>

          <div className="grid gap-3">
            <SeedButton
              label="1. Building Categories"
              description="8 building types (Tower, Villa, etc.)"
              endpoint="/api/building-categories/seed"
              onSeed={handleIndividualSeed}
              disabled={seeding}
            />
            
            <SeedButton
              label="2. Properties"
              description="6 properties (VGP, VCP, Masteri, etc.)"
              endpoint="/api/properties/seed"
              onSeed={handleIndividualSeed}
              disabled={seeding}
            />
            
            <SeedButton
              label="3. Zones"
              description="11 zones/areas"
              endpoint="/api/zones/seed"
              onSeed={handleIndividualSeed}
              disabled={seeding}
            />
            
            <SeedButton
              label="4. Buildings"
              description="13 buildings/blocks"
              endpoint="/api/buildings/seed"
              onSeed={handleIndividualSeed}
              disabled={seeding}
            />
            
            <SeedButton
              label="5. Floors"
              description="~60 floors (sampled)"
              endpoint="/api/floors/seed"
              onSeed={handleIndividualSeed}
              disabled={seeding}
            />
            
            <SeedButton
              label="6. Property Units"
              description="~120 apartments/units"
              endpoint="/api/property-units/seed"
              onSeed={handleIndividualSeed}
              disabled={seeding}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Info Section */}
      <ComponentCard title="ℹ️ Information">
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong className="text-gray-900 dark:text-white">Database Hierarchy:</strong>
            <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
{`Properties (Dự án)
  └── Zones (Khu vực)
      └── Buildings (Tòa nhà) + Building Category
          └── Floors (Tầng)
              └── Property Units (Căn hộ)`}
            </pre>
          </div>

          <div>
            <strong className="text-gray-900 dark:text-white">Notes:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>All tables use UUID primary keys</li>
              <li>CASCADE DELETE for parent-child relationships</li>
              <li>Property Units include address, province, district, ward</li>
              <li>Property Units can be linked to Residents via resident_id</li>
              <li>Seeding uses UPSERT - safe to run multiple times</li>
            </ul>
          </div>

          <div>
            <strong className="text-gray-900 dark:text-white">Before seeding:</strong>
            <p className="mt-2">Make sure you have applied the schema in Supabase SQL Editor:</p>
            <code className="block mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
              building-management-schema.sql
            </code>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

interface SeedButtonProps {
  label: string;
  description: string;
  endpoint: string;
  onSeed: (endpoint: string, name: string) => void;
  disabled: boolean;
}

function SeedButton({ label, description, endpoint, onSeed, disabled }: SeedButtonProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
      </div>
      <button
        onClick={() => onSeed(endpoint, label)}
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Seed
      </button>
    </div>
  );
}
