'use client';

import { FaFlask, FaHistory, FaCode } from 'react-icons/fa';

interface TabNavigationProps {
  activeTab: 'test' | 'mock' | 'history';
  setActiveTab: (tab: 'test' | 'mock' | 'history') => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => setActiveTab('test')}
        className={`flex items-center px-4 py-3 font-medium text-sm ${
          activeTab === 'test'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FaFlask className="mr-2" />
        接口测试
      </button>
      
      <button
        onClick={() => setActiveTab('mock')}
        className={`flex items-center px-4 py-3 font-medium text-sm ${
          activeTab === 'mock'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FaCode className="mr-2" />
        Mock数据
      </button>
      
      <button
        onClick={() => setActiveTab('history')}
        className={`flex items-center px-4 py-3 font-medium text-sm ${
          activeTab === 'history'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FaHistory className="mr-2" />
        历史记录
      </button>
    </div>
  );
}