import { createClient } from '@supabase/supabase-js';

// Your web app's Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== "YOUR_SUPABASE_URL" && 
  supabaseUrl.startsWith("http");

const safeSave = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("LocalStorage save failed:", e);
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
      alert("Storage limit exceeded! The image is too large. Please upload a smaller image or crop it.");
    } else {
      alert("Failed to save data locally: " + e.message);
    }
    return false;
  }
};

class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.limitVal = null;
    this.orderVal = null;
    this.isSingle = false;
    this.operation = 'select'; // 'select', 'insert', 'update', 'delete', 'upsert'
    this.rowsToInsert = [];
    this.updateFields = null;
    this.upsertData = null;
  }

  select(columns) {
    if (this.operation !== 'insert' && this.operation !== 'update' && this.operation !== 'delete' && this.operation !== 'upsert') {
      this.operation = 'select';
    }
    return this;
  }

  insert(rows) {
    this.operation = 'insert';
    this.rowsToInsert = rows;
    return this;
  }

  update(fields) {
    this.operation = 'update';
    this.updateFields = fields;
    return this;
  }

  upsert(rowOrRows) {
    this.operation = 'upsert';
    this.upsertData = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  eq(column, value) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  in(column, values) {
    this.filters.push({ type: 'in', column, values });
    return this;
  }

  limit(limitVal) {
    this.limitVal = limitVal;
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderVal = { column, ascending };
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async then(resolve, reject) {
    try {
      const data = await this.execute();
      resolve({ data, error: null });
    } catch (err) {
      resolve({ data: null, error: err });
    }
  }

  async execute() {
    const storageKey = `mock_supabase_${this.table}`;
    let items = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        items = JSON.parse(stored);
      } else {
        if (this.table === 'settings') {
          items = [{ id: 'salonLocation', address: 'Nangloi Prem Nagar 3, Durga Chowk, Delhi' }];
          safeSave(storageKey, items);
        } else if (this.table === 'hairstyles') {
          items = [
            { id: 'h1', name: 'Classic Pompadour', price: '500', imageUrl: '' },
            { id: 'h2', name: 'Modern Fade', price: '350', imageUrl: '' },
            { id: 'h3', name: 'Luxury Beard Trim', price: '250', imageUrl: '' }
          ];
          safeSave(storageKey, items);
        } else if (this.table === 'appointments') {
          items = [];
          safeSave(storageKey, items);
        }
      }
    } catch (e) {
      console.error('Mock storage access failed', e);
    }

    if (this.operation === 'select') {
      let filtered = [...items];
      for (const filter of this.filters) {
        if (filter.type === 'eq') {
          filtered = filtered.filter(item => item[filter.column] === filter.value);
        } else if (filter.type === 'in') {
          filtered = filtered.filter(item => filter.values.includes(item[filter.column]));
        }
      }
      if (this.orderVal) {
        const { column, ascending } = this.orderVal;
        filtered.sort((a, b) => {
          const valA = a[column] || '';
          const valB = b[column] || '';
          if (valA < valB) return ascending ? -1 : 1;
          if (valA > valB) return ascending ? 1 : -1;
          return 0;
        });
      }
      if (this.limitVal !== null) {
        filtered = filtered.slice(0, this.limitVal);
      }
      if (this.isSingle) {
        return filtered[0] || null;
      }
      return filtered;
    }

    if (this.operation === 'insert') {
      const newRows = this.rowsToInsert.map(row => ({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        ...row
      }));
      items.push(...newRows);
      safeSave(storageKey, items);
      return newRows;
    }

    if (this.operation === 'update') {
      let updatedRows = [];
      items = items.map(item => {
        let matches = true;
        for (const filter of this.filters) {
          if (filter.type === 'eq') {
            if (item[filter.column] !== filter.value) matches = false;
          } else if (filter.type === 'in') {
            if (!filter.values.includes(item[filter.column])) matches = false;
          }
        }
        if (matches) {
          const updated = { ...item, ...this.updateFields };
          updatedRows.push(updated);
          return updated;
        }
        return item;
      });
      safeSave(storageKey, items);
      return updatedRows;
    }

    if (this.operation === 'upsert') {
      const upserted = [];
      for (const row of this.upsertData) {
        const idx = items.findIndex(item => item.id === row.id);
        if (idx > -1) {
          items[idx] = { ...items[idx], ...row };
          upserted.push(items[idx]);
        } else {
          const newRow = {
            id: row.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9)),
            created_at: new Date().toISOString(),
            ...row
          };
          items.push(newRow);
          upserted.push(newRow);
        }
      }
      safeSave(storageKey, items);
      return upserted;
    }

    if (this.operation === 'delete') {
      items = items.filter(item => {
        let matches = true;
        for (const filter of this.filters) {
          if (filter.type === 'eq') {
            if (item[filter.column] !== filter.value) matches = false;
          } else if (filter.type === 'in') {
            if (!filter.values.includes(item[filter.column])) matches = false;
          }
        }
        return !matches;
      });
      safeSave(storageKey, items);
      return [];
    }

    return null;
  }
}

const mockSupabase = {
  from(tableName) {
    return new MockQueryBuilder(tableName);
  }
};

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;

