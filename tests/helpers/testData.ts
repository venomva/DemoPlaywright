import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** One row of data/customers.csv — the customer details used at checkout. */
export type Customer = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
};

const CUSTOMERS_CSV = join(process.cwd(), 'data', 'customers.csv');

/** Minimal CSV reader for data/customers.csv (header row + simple quoted/unquoted fields). */
export function loadCustomers(): Customer[] {
  const raw = readFileSync(CUSTOMERS_CSV, 'utf-8').trim();
  const [headerLine, ...lines] = raw.split(/\r?\n/);
  const headers = headerLine.split(',').map((h) => h.trim());

  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const cells = line.split(',').map((c) => c.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, i) => {
        row[header] = cells[i] ?? '';
      });
      return row as unknown as Customer;
    });
}

/** The first customer row (the test uses one row). */
export function firstCustomer(): Customer {
  const [row] = loadCustomers();
  if (!row) {
    throw new Error('data/customers.csv has no data rows');
  }
  return row;
}
