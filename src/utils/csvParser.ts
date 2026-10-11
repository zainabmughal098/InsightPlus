import { DataRecord } from '../data/sampleData';

export function parseCSV(text: string): { records: DataRecord[]; warnings: string[] } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV file must have a header row and at least one data row.');
  }

  // Parse header
  const headers = splitCSVRow(lines[0]).map((h) => h.toLowerCase().trim().replace(/['"]/g, ''));

  // Header matching helpers
  const findCol = (...keywords: string[]) => {
    return headers.findIndex((h) => keywords.some((k) => h.includes(k)));
  };

  const dateIdx = findCol('date', 'time', 'period', 'day');
  const monthIdx = findCol('month');
  const quarterIdx = findCol('quarter', 'qtr');
  const productIdx = findCol('product', 'item', 'sku', 'name', 'title');
  const categoryIdx = findCol('category', 'dept', 'department', 'type', 'group');
  const regionIdx = findCol('region', 'location', 'market', 'country', 'territory', 'zone');
  const channelIdx = findCol('channel', 'medium', 'store', 'source');
  const revenueIdx = findCol('revenue', 'sales', 'amount', 'total', 'gmv');
  const unitsIdx = findCol('unit', 'qty', 'quantity', 'count', 'volume');
  const priceIdx = findCol('price', 'unitprice', 'rate');
  const costIdx = findCol('cost', 'cogs');
  const marginIdx = findCol('margin', 'profit', 'grossmargin');
  const returnIdx = findCol('return', 'refund');
  const ratingIdx = findCol('rating', 'score', 'csat');

  const records: DataRecord[] = [];
  const warnings: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = splitCSVRow(lines[i]);
    if (rawCols.length === 0 || rawCols.every((c) => c.trim() === '')) continue;

    const getVal = (idx: number, fallback = '') => {
      if (idx === -1 || idx >= rawCols.length) return fallback;
      return rawCols[idx].trim().replace(/^["']|["']$/g, '');
    };

    const getNum = (idx: number, fallback = 0) => {
      if (idx === -1 || idx >= rawCols.length) return fallback;
      const clean = rawCols[idx].replace(/[^0-9.-]+/g, '');
      const parsed = parseFloat(clean);
      return isNaN(parsed) ? fallback : parsed;
    };

    const rawDate = getVal(dateIdx, new Date().toISOString().split('T')[0]);
    const rawProduct = getVal(productIdx, `Product ${i}`);
    const rawCategory = getVal(categoryIdx, 'General');
    const rawRegion = getVal(regionIdx, 'Global');
    const rawChannel = getVal(channelIdx, 'Direct');
    
    let revenue = getNum(revenueIdx, 0);
    let units = Math.round(getNum(unitsIdx, 1));
    let unitPrice = getNum(priceIdx, 0);

    if (revenue === 0 && units > 0 && unitPrice > 0) {
      revenue = units * unitPrice;
    } else if (unitPrice === 0 && revenue > 0 && units > 0) {
      unitPrice = Math.round((revenue / units) * 100) / 100;
    }

    const cost = getNum(costIdx, Math.round(revenue * 0.4));
    let margin = getNum(marginIdx, 0);
    if (margin === 0 && revenue > 0) {
      margin = Math.round(((revenue - cost) / revenue) * 1000) / 10;
    }

    const returnRate = getNum(returnIdx, 3.2);
    const rating = Math.min(5, Math.max(1, getNum(ratingIdx, 4.8)));

    let month = getVal(monthIdx);
    if (!month && rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          month = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        } else {
          month = 'Jan 2025';
        }
      } catch {
        month = 'Jan 2025';
      }
    }

    let quarter = getVal(quarterIdx);
    if (!quarter && rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          const q = Math.floor(d.getMonth() / 3) + 1;
          quarter = `Q${q} ${d.getFullYear()}`;
        } else {
          quarter = 'Q1 2025';
        }
      } catch {
        quarter = 'Q1 2025';
      }
    }

    records.push({
      id: `custom-${i}-${Math.random().toString(36).substring(2, 7)}`,
      date: rawDate,
      month: month || 'Jan 2025',
      quarter: quarter || 'Q1 2025',
      product: rawProduct,
      category: rawCategory,
      region: rawRegion,
      channel: rawChannel,
      revenue,
      unitsSold: Math.max(1, units),
      unitPrice,
      cost,
      margin: margin || 60,
      returnRate,
      rating,
    });
  }

  if (records.length === 0) {
    throw new Error('No valid data rows found in the CSV file.');
  }

  return { records, warnings };
}

function splitCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function generateSampleCSVString(): string {
  return `Date,Product,Category,Region,Channel,Revenue,UnitsSold,UnitPrice,Cost,Margin,ReturnRate,Rating
2025-01-15,Premium Tailored Trousers,Trousers & Bottoms,North America,Online Store,28400,190,150,10200,64.1,3.4,4.8
2025-01-20,Premium Tailored Trousers,Trousers & Bottoms,Europe,Retail Flagship,22500,150,150,8100,64.0,2.9,4.9
2025-02-14,Premium Tailored Trousers,Trousers & Bottoms,North America,Retail Flagship,33750,225,150,12150,64.0,3.1,4.7
2025-02-18,Premium Tailored Trousers,Trousers & Bottoms,Asia Pacific,Online Store,19500,130,150,7020,64.0,4.0,4.6
2025-03-12,Premium Tailored Trousers,Trousers & Bottoms,Europe,Online Store,27000,180,150,9720,64.0,3.2,4.9
2025-04-10,Premium Tailored Trousers,Trousers & Bottoms,North America,Online Store,37500,250,150,13500,64.0,2.8,4.9
2025-01-18,Structured Wool Blazer,Suiting & Tailoring,North America,Retail Flagship,38400,120,320,14400,62.5,4.2,4.7
2025-02-22,Structured Wool Blazer,Suiting & Tailoring,Europe,Retail Flagship,44800,140,320,16800,62.5,3.5,4.9
2025-03-20,Structured Wool Blazer,Suiting & Tailoring,Asia Pacific,Online Store,28800,90,320,10800,62.5,4.8,4.6
2025-01-10,Cashmere Knit Crewneck,Knitwear,Europe,Retail Flagship,46200,210,220,17850,61.4,2.1,4.9
2025-02-12,Cashmere Knit Crewneck,Knitwear,North America,Online Store,52800,240,220,20400,61.4,2.5,4.9
2025-01-22,Italian Leather Loafers,Footwear,Europe,Retail Flagship,33600,120,280,13440,60.0,5.1,4.7
2025-02-19,Italian Leather Loafers,Footwear,North America,Online Store,39200,140,280,15680,60.0,6.2,4.6
2025-01-25,Classic Supima Oxford Shirt,Shirts & Tops,North America,Online Store,24750,225,110,8415,66.0,2.2,4.8
2025-02-28,Classic Supima Oxford Shirt,Shirts & Tops,Europe,Retail Flagship,20900,190,110,7106,66.0,2.0,4.9`;
}
