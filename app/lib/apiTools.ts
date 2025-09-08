import axios from 'axios';
import type { ApiRequest } from '@/app/components/ApiTestComponent';

// 发送接口请求
export const sendApiRequest = async (request: ApiRequest) => {
  try {
    const axiosConfig = {
      method: request.method,
      url: request.url,
      headers: request.headers,
      data: request.body
    };
    const res = await axios(axiosConfig);
    return { data: res.data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'An unknown error occurred';
    return { data: null, error };
  }
};

// 生成模拟数据
export const generateMockData = (schema: Record<string, any>): Record<string, any> => {
  const mockData: Record<string, any> = {};
  for (const key in schema) {
    if (typeof schema[key] === 'string') {
      if (schema[key] === 'string') mockData[key] = `mock_${key}`;
      else if (schema[key] === 'number') mockData[key] = Math.floor(Math.random() * 100);
      else if (schema[key] === 'boolean') mockData[key] = Math.random() > 0.5;
      else mockData[key] = schema[key];
    } else if (typeof schema[key] === 'object') {
      mockData[key] = generateMockData(schema[key]);
    }
  }
  return mockData;
};

// 按类型分组接口记录
export const groupRecordsByType = (records: any[]) => {
  const grouped: Record<string, any[]> = {};
  records.forEach(record => {
    if (!grouped[record.type]) {
      grouped[record.type] = [];
    }
    grouped[record.type].push(record);
  });
  return grouped;
};