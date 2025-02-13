'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Interfaces
interface DataPoint {
  time: string;
  [key: string]: string | number;
}

interface Building {
  id: string;
  name: string;
  color: string;
}

interface BuildingFloor {
  floors: string[];
  values: {
    [key: string]: number[];
  };
}

interface BuildingData {
  [key: string]: BuildingFloor;
}

interface ExpandedBuildings {
  [key: string]: boolean;
}

interface ExportData {
  Building: string;
  Floor: string;
  [key: string]: string | number;
}

// Time Period Types
type TimePeriod = 'hourly' | 'daily' | 'monthly' | 'yearly';

interface TimePeriodOption {
  value: TimePeriod;
  label: string;
}


interface DateRange {
  start: string;
  end: string;
}

interface DateSelectionState {
  singleDate?: string;
  monthYear?: string;
  dateRange?: DateRange;
  yearRange?: DateRange;
}









const TIME_PERIODS: TimePeriodOption[] = [
  { value: 'hourly', label: 'รายชั่วโมง' },
  { value: 'daily', label: 'รายวัน' },
  { value: 'monthly', label: 'รายเดือน' },
  { value: 'yearly', label: 'รายปี' },
];

// Mock data for different time periods
const HOURLY_DATA: DataPoint[] = [
  { time: '0:00', building1: 6000, building2: 6500, building3: 0, building4: 5500, building5: 7000 },
  { time: '2:00', building1: 15000, building2: 12500, building3: 7500, building4: 13000, building5: 11000 },
  { time: '4:00', building1: 10000, building2: 5000, building3: 5000, building4: 8000, building5: 9000 },
  { time: '6:00', building1: 2500, building2: 0, building3: 2500, building4: 3000, building5: 4000 },
  { time: '8:00', building1: 0, building2: 2500, building3: 0, building4: 1500, building5: 2000 },
  { time: '10:00', building1: 2500, building2: 7500, building3: 5000, building4: 6000, building5: 5500 },
  { time: '12:00', building1: 7500, building2: 2500, building3: 10000, building4: 9000, building5: 8500 },
  { time: '14:00', building1: 10000, building2: 0, building3: 7500, building4: 8500, building5: 7000 },
  { time: '16:00', building1: 5000, building2: 2500, building3: 5000, building4: 4500, building5: 6000 },
  { time: '18:00', building1: 0, building2: 5000, building3: 2500, building4: 3500, building5: 4000 },
  { time: '20:00', building1: 2500, building2: 0, building3: 7500, building4: 6500, building5: 5500 },
  { time: '22:00', building1: 5000, building2: 6500, building3: 12500, building4: 11000, building5: 10000 }
];

const DAILY_DATA: DataPoint[] = [
  { time: 'จ.', building1: 45000, building2: 42000, building3: 38000, building4: 41000, building5: 39000 },
  { time: 'อ.', building1: 48000, building2: 45000, building3: 40000, building4: 43000, building5: 41000 },
  { time: 'พ.', building1: 42000, building2: 39000, building3: 36000, building4: 38000, building5: 37000 },
  { time: 'พฤ.', building1: 46000, building2: 43000, building3: 39000, building4: 42000, building5: 40000 },
  { time: 'ศ.', building1: 44000, building2: 41000, building3: 37000, building4: 40000, building5: 38000 },
  { time: 'ส.', building1: 35000, building2: 32000, building3: 28000, building4: 31000, building5: 29000 },
  { time: 'อา.', building1: 30000, building2: 27000, building3: 23000, building4: 26000, building5: 24000 }
];

const MONTHLY_DATA: DataPoint[] = [
  { time: 'ม.ค.', building1: 1200000, building2: 1150000, building3: 1100000, building4: 1180000, building5: 1130000 },
  { time: 'ก.พ.', building1: 1150000, building2: 1100000, building3: 1050000, building4: 1130000, building5: 1080000 },
  { time: 'มี.ค.', building1: 1300000, building2: 1250000, building3: 1200000, building4: 1280000, building5: 1230000 },
  { time: 'เม.ย.', building1: 1400000, building2: 1350000, building3: 1300000, building4: 1380000, building5: 1330000 },
  { time: 'พ.ค.', building1: 1450000, building2: 1400000, building3: 1350000, building4: 1430000, building5: 1380000 },
  { time: 'มิ.ย.', building1: 1500000, building2: 1450000, building3: 1400000, building4: 1480000, building5: 1430000 }
];

const YEARLY_DATA: DataPoint[] = [
  { time: '2019', building1: 15000000, building2: 14500000, building3: 14000000, building4: 14800000, building5: 14300000 },
  { time: '2020', building1: 14000000, building2: 13500000, building3: 13000000, building4: 13800000, building5: 13300000 },
  { time: '2021', building1: 14500000, building2: 14000000, building3: 13500000, building4: 14300000, building5: 13800000 },
  { time: '2022', building1: 15500000, building2: 15000000, building3: 14500000, building4: 15300000, building5: 14800000 },
  { time: '2023', building1: 16000000, building2: 15500000, building3: 15000000, building4: 15800000, building5: 15300000 }
];

// Constants
const BUILDINGS: Building[] = [
  { id: 'building1', name: 'อาคาร 1', color: '#855DFE' },
  { id: 'building2', name: 'อาคาร 2', color: '#F9A340' },
  { id: 'building3', name: 'อาคาร 3', color: '#37E3BB' },
  { id: 'building4', name: 'อาคาร 4', color: '#FF6B6B' },
  { id: 'building5', name: 'อาคาร 5', color: '#4ECDC4' }
];

const TIME_DATA: DataPoint[] = [
  { time: '0:00', building1: 6000, building2: 6500, building3: 0, building4: 5500, building5: 7000 },
  { time: '2:00', building1: 15000, building2: 12500, building3: 7500, building4: 13000, building5: 11000 },
  { time: '4:00', building1: 10000, building2: 5000, building3: 5000, building4: 8000, building5: 9000 },
  { time: '6:00', building1: 2500, building2: 0, building3: 2500, building4: 3000, building5: 4000 },
  { time: '8:00', building1: 0, building2: 2500, building3: 0, building4: 1500, building5: 2000 },
  { time: '10:00', building1: 2500, building2: 7500, building3: 5000, building4: 6000, building5: 5500 },
  { time: '12:00', building1: 7500, building2: 2500, building3: 10000, building4: 9000, building5: 8500 },
  { time: '14:00', building1: 10000, building2: 0, building3: 7500, building4: 8500, building5: 7000 },
  { time: '16:00', building1: 5000, building2: 2500, building3: 5000, building4: 4500, building5: 6000 },
  { time: '18:00', building1: 0, building2: 5000, building3: 2500, building4: 3500, building5: 4000 },
  { time: '20:00', building1: 2500, building2: 0, building3: 7500, building4: 6500, building5: 5500 },
  { time: '22:00', building1: 5000, building2: 6500, building3: 12500, building4: 11000, building5: 10000 },
  { time: '24:00', building1: 0, building2: 0, building3: 0, building4: 0, building5: 0 }
];

const TIME_SLOTS = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'];

const ALL_BUILDING_DATA: BuildingData = {
  'อาคาร 1': {
    floors: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3'],
    values: {
      'ชั้น 1': [1250, 1480, 1320, 1100, 980, 1050, 1200, 1350],
      'ชั้น 2': [980, 1100, 1250, 1400, 1320, 1180, 1090, 1200],
      'ชั้น 3': [850, 920, 1100, 1280, 1150, 1000, 950, 880]
    }
  },
  'อาคาร 2': {
    floors: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3', 'ชั้น 4'],
    values: {
      'ชั้น 1': [1500, 1620, 1480, 1350, 1280, 1420, 1550, 1600],
      'ชั้น 2': [1200, 1350, 1420, 1500, 1380, 1250, 1180, 1300],
      'ชั้น 3': [980, 1050, 1180, 1250, 1150, 1080, 950, 920],
      'ชั้น 4': [850, 920, 1000, 1150, 1080, 950, 880, 820]
    }
  },
  'อาคาร 3': {
    floors: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3'],
    values: {
      'ชั้น 1': [1800, 1950, 1850, 1720, 1650, 1780, 1900, 1850],
      'ชั้น 2': [1500, 1620, 1580, 1450, 1380, 1420, 1500, 1480],
      'ชั้น 3': [1200, 1280, 1350, 1420, 1380, 1250, 1180, 1150]
    }
  },
  'อาคาร 4': {
    floors: ['ชั้น 1', 'ชั้น 2'],
    values: {
      'ชั้น 1': [2200, 2350, 2180, 2050, 1950, 2080, 2250, 2300],
      'ชั้น 2': [1800, 1950, 1880, 1750, 1680, 1750, 1850, 1900]
    }
  },
  'อาคาร 5': {
    floors: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3', 'ชั้น 4'],
    values: {
      'ชั้น 1': [1650, 1780, 1850, 1720, 1650, 1580, 1500, 1620],
      'ชั้น 2': [1420, 1500, 1580, 1450, 1380, 1320, 1250, 1380],
      'ชั้น 3': [1180, 1250, 1320, 1280, 1150, 1080, 1020, 1150],
      'ชั้น 4': [950, 1020, 1080, 1150, 1080, 980, 920, 880]
    }
  }
};

// Icon Components
const ChevronIcon: React.FC<{ isUp: boolean }> = ({ isUp }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {isUp ? (
      <polyline points="18 15 12 9 6 15"></polyline>
    ) : (
      <polyline points="6 9 12 15 18 9"></polyline>
    )}
  </svg>
);

const FilterIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const NotificationIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// Export Functions
const prepareExportData = (buildingData: BuildingData, timeSlots: string[]): ExportData[] => {
  const data: ExportData[] = [];
  Object.entries(buildingData).forEach(([building, { floors, values }]) => {
    floors.forEach((floor) => {
      const row: ExportData = {
        'Building': building,
        'Floor': floor,
      };
      timeSlots.forEach((time, index) => {
        row[time] = values[floor][index];
      });
      data.push(row);
    });
  });
  return data;
};

const exportToExcel = (buildingData: BuildingData, timeSlots: string[]): void => {
  const data = prepareExportData(buildingData, timeSlots);
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Power Usage Report");
  XLSX.writeFile(wb, "power_usage_report.xlsx");
};

const exportToPDF = (buildingData: BuildingData, timeSlots: string[]): void => {
  const doc = new jsPDF();
  const data = prepareExportData(buildingData, timeSlots);
  
  doc.text("Power Usage Report", 14, 15);
  doc.autoTable({
    head: [['Building', 'Floor', ...timeSlots]],
    body: data.map(row => [
      row.Building,
      row.Floor,
      ...timeSlots.map(time => row[time])
    ]),
    startY: 20,
  });
  
  doc.save("power_usage_report.pdf");
};

// const getDataByTimePeriod = (period: TimePeriod) => {
//   switch (period) {
//     case 'hourly':
//       return HOURLY_DATA;
//     case 'daily':
//       return DAILY_DATA;
//     case 'monthly':
//       return MONTHLY_DATA;
//     case 'yearly':
//       return YEARLY_DATA;
//     default:
//       return HOURLY_DATA;
//   }
// };


const ReportsPage: React.FC = () => {
  // Add separate time period states
  const [chartTimePeriod, setChartTimePeriod] = useState<TimePeriod>('hourly');
  const [tableTimePeriod, setTableTimePeriod] = useState<TimePeriod>('hourly');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>('hourly');
  const [startYear, setStartYear] = useState('2013');
  const [endYear, setEndYear] = useState('2024');
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'building';

  // States
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>(['building1', 'building2', 'building3']);
  const [selectedDate, setSelectedDate] = useState<string>('2024-12-21');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tableSelectedDate, setTableSelectedDate] = useState('2024-12-21');
  const [tableCalendarOpen, setTableCalendarOpen] = useState(false);
  const [buildingSelectionOpen, setBuildingSelectionOpen] = useState(false);
  const [tableSelectedBuildings, setTableSelectedBuildings] = useState(['อาคาร 1', 'อาคาร 2']);
  const [tableExpandedBuildings, setTableExpandedBuildings] = useState<ExpandedBuildings>({
    'อาคาร 1': true,
    'อาคาร 2': true
  });


// Sample data for different time periods
  const dailyData = [
    { time: 'จ.', building1: 15000, building2: 10000, building3: 6000 },
    { time: 'อ.', building1: 15000, building2: 10000, building3: 6500 },
    { time: 'พ.', building1: 15000, building2: 10000, building3: 6200 },
    { time: 'พฤ.', building1: 15000, building2: 10000, building3: 6300 },
    { time: 'ศ.', building1: 15000, building2: 10000, building3: 6400 },
    { time: 'ส.', building1: 15000, building2: 10000, building3: 6100 },
    { time: 'อา.', building1: 15000, building2: 10000, building3: 6200 }
  ];

  const monthlyData = [
    { time: 'ม.ค.', building1: 15000, building2: 10000, building3: 6000 },
    { time: 'ก.พ.', building1: 15000, building2: 10000, building3: 6200 },
    { time: 'มี.ค.', building1: 15000, building2: 10000, building3: 6400 },
    { time: 'เม.ย.', building1: 15000, building2: 10000, building3: 6300 },
    { time: 'พ.ค.', building1: 15000, building2: 10000, building3: 6500 },
    { time: 'มิ.ย.', building1: 15000, building2: 10000, building3: 6200 },
    { time: 'ก.ค.', building1: 15000, building2: 10000, building3: 6100 },
    { time: 'ส.ค.', building1: 15000, building2: 10000, building3: 6300 },
    { time: 'ก.ย.', building1: 15000, building2: 10000, building3: 6400 },
    { time: 'ต.ค.', building1: 15000, building2: 10000, building3: 6200 },
    { time: 'พ.ย.', building1: 15000, building2: 10000, building3: 6300 },
    { time: 'ธ.ค.', building1: 15000, building2: 10000, building3: 6100 }
  ];

  const yearlyData = [
    { time: '2013', building1: 15000, building2: 10000, building3: 6000 },
    { time: '2014', building1: 15000, building2: 10000, building3: 6200 },
    { time: '2015', building1: 15000, building2: 10000, building3: 6400 },
    { time: '2016', building1: 15000, building2: 10000, building3: 6300 },
    { time: '2017', building1: 15000, building2: 10000, building3: 6500 },
    { time: '2018', building1: 15000, building2: 10000, building3: 6200 },
    { time: '2019', building1: 15000, building2: 10000, building3: 6100 },
    { time: '2020', building1: 15000, building2: 10000, building3: 6300 },
    { time: '2021', building1: 15000, building2: 10000, building3: 6400 },
    { time: '2022', building1: 15000, building2: 10000, building3: 6200 },
    { time: '2023', building1: 15000, building2: 10000, building3: 6300 },
    { time: '2024', building1: 15000, building2: 10000, building3: 6100 }
  ];


  const getDataByTimeRange = () => {
    let data;
    switch (timeRange) {
      case 'daily':
        data = dailyData;
        break;
      case 'monthly':
        data = monthlyData;
        break;
      case 'yearly':
        data = yearlyData.filter(item => {
          const year = parseInt(item.time);
          return year >= parseInt(startYear) && year <= parseInt(endYear);
        });
        break;
      default:
        data = dailyData;
    }
    return data;
  };




  const getDataByTimePeriod = (period: TimePeriod) => {
    switch (period) {
      case 'hourly':
        return HOURLY_DATA;
      case 'daily':
        return DAILY_DATA;
      case 'monthly':
        return MONTHLY_DATA;
      case 'yearly':
        return YEARLY_DATA.filter(item => {
          const year = parseInt(item.time);
          return year >= parseInt(startYear) && year <= parseInt(endYear);
        });
      default:
        return HOURLY_DATA;
    }
  };

  // Handlers
  const handleTypeChange = (newType: string) => {
    router.push(`/reports?type=${newType}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setIsCalendarOpen(false);
  };

  const toggleBuilding = (buildingId: string) => {
    setSelectedBuildings(prev =>
      prev.includes(buildingId)
        ? prev.filter(id => id !== buildingId)
        : [...prev, buildingId]
    );
  };

  const handleTableBuildingSelection = (building: string) => {
    setTableSelectedBuildings(prev => {
      const newSelection = prev.includes(building)
        ? prev.filter(b => b !== building)
        : [...prev, building];
      
      if (!prev.includes(building)) {
        setTableExpandedBuildings(prevExpanded => ({
          ...prevExpanded,
          [building]: true
        }));
      }
      
      return newSelection;
    });
  };

  const toggleTableBuilding = (building: string) => {
    setTableExpandedBuildings(prev => ({
      ...prev,
      [building]: !prev[building]
    }));
  };



// Add new state variables
const [dateSelection, setDateSelection] = useState<DateSelectionState>({
  singleDate: new Date().toISOString().split('T')[0],
  monthYear: new Date().toISOString().slice(0, 7),
  dateRange: {
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  yearRange: {
    start: new Date().getFullYear().toString(),
    end: new Date().getFullYear().toString()
  }
});


// Add this function to render the appropriate date selector
const renderDateSelector = () => {
  switch (selectedTimePeriod) {
    case 'hourly':
      return (
        <Popover>
          <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            <span>{dateSelection.singleDate}</span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <input
              type="date"
              value={dateSelection.singleDate}
              onChange={(e) => setDateSelection(prev => ({
                ...prev,
                singleDate: e.target.value
              }))}
              className="p-2 border-0 focus:outline-none"
            />
          </PopoverContent>
        </Popover>
      );

    case 'daily':
      return (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>เลือกช่วงวันที่</span>
            </PopoverTrigger>
            <PopoverContent className="p-2" align="end">
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">วันที่เริ่มต้น</label>
                  <input
                    type="date"
                    value={dateSelection.dateRange?.start}
                    onChange={(e) => setDateSelection(prev => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange!,
                        start: e.target.value
                      }
                    }))}
                    className="w-full p-1 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    value={dateSelection.dateRange?.end}
                    onChange={(e) => setDateSelection(prev => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange!,
                        end: e.target.value
                      }
                    }))}
                    className="w-full p-1 mt-1 border rounded"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-sm text-gray-500">หรือ</span>
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>เลือกเดือน</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <input
                type="month"
                value={dateSelection.monthYear}
                onChange={(e) => setDateSelection(prev => ({
                  ...prev,
                  monthYear: e.target.value
                }))}
                className="p-2 border-0 focus:outline-none"
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case 'monthly':
      return (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>เลือกช่วงเดือน</span>
            </PopoverTrigger>
            <PopoverContent className="p-2" align="end">
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">เดือนเริ่มต้น</label>
                  <input
                    type="month"
                    value={dateSelection.dateRange?.start}
                    onChange={(e) => setDateSelection(prev => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange!,
                        start: e.target.value
                      }
                    }))}
                    className="w-full p-1 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">เดือนสิ้นสุด</label>
                  <input
                    type="month"
                    value={dateSelection.dateRange?.end}
                    onChange={(e) => setDateSelection(prev => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange!,
                        end: e.target.value
                      }
                    }))}
                    className="w-full p-1 mt-1 border rounded"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-sm text-gray-500">หรือ</span>
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>เลือกปี</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <select
                value={dateSelection.yearRange?.start}
                onChange={(e) => setDateSelection(prev => ({
                  ...prev,
                  yearRange: {
                    start: e.target.value,
                    end: e.target.value
                  }
                }))}
                className="p-2 border-0 focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => 2013 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </PopoverContent>
          </Popover>
        </div>
      );

    case 'yearly':
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">ตั้งแต่:</span>
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>{dateSelection.yearRange?.start}</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <select
                value={dateSelection.yearRange?.start}
                onChange={(e) => setDateSelection(prev => ({
                  ...prev,
                  yearRange: {
                    ...prev.yearRange!,
                    start: e.target.value
                  }
                }))}
                className="p-2 border-0 focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => 2013 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </PopoverContent>
          </Popover>

          <span className="text-sm text-gray-500">ถึง:</span>
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>{dateSelection.yearRange?.end}</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <select
                value={dateSelection.yearRange?.end}
                onChange={(e) => setDateSelection(prev => ({
                  ...prev,
                  yearRange: {
                    ...prev.yearRange!,
                    end: e.target.value
                  }
                }))}
                className="p-2 border-0 focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => 2013 + i)
                  .filter(year => year >= parseInt(dateSelection.yearRange?.start || '2013'))
                  .map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
              </select>
            </PopoverContent>
          </Popover>
        </div>
      );

    default:
      return null;
  }
};


  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">รายงานแสดงผล</h1>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <div className="w-5 h-5">
            <NotificationIcon />
          </div>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button 
          onClick={() => handleTypeChange('building')}
          className={`px-4 py-2 rounded-full ${
            type === 'building' 
              ? 'bg-indigo-700 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ไฟฟ้าอาคาร
        </button>
        <button 
          onClick={() => handleTypeChange('solar')}
          className={`px-4 py-2 rounded-full ${
            type === 'solar' 
              ? 'bg-indigo-700 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          โซลาร์เซลล์
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-6">
        {type === 'building' ? (
          <div className="space-y-6">
            {/* Energy Usage Chart */}
               <div className="w-full h-96 p-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">การใช้พลังงานของอาคาร (ยูนิต)</h2>
                <div className="flex items-center gap-4">
                 {renderDateSelector()}


                  {/* Time Period Dropdown */}
                  <Popover>
    <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50">
      <span className="text-sm">{TIME_PERIODS.find(p => p.value === selectedTimePeriod)?.label}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </PopoverTrigger>
    <PopoverContent className="w-48 p-1" align="end">
      <div className="py-1">
        {TIME_PERIODS.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedTimePeriod(period.value)}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded"
          >
            {period.label}
          </button>
        ))}
      </div>
    </PopoverContent>
  </Popover>

                  {/* Building Filter */}
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                      <FilterIcon />
                    
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                      <div className="space-y-2">
                        {BUILDINGS.map((building) => (
                          <label
                            key={building.id}
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBuildings.includes(building.id)}
                              onChange={() => toggleBuilding(building.id)}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: building.color }}></div>
                              <span className="text-sm">{building.name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Chart */}
              {/* Chart */}
              <ResponsiveContainer width="100%" height="85%">
                {selectedTimePeriod === 'hourly' ? (
                  <LineChart data={getDataByTimePeriod(selectedTimePeriod)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, 15000]}
                      ticks={[0, 2500, 5000, 7500, 10000, 12500, 15000]}
                    />
                    {BUILDINGS.map(building => 
                      selectedBuildings.includes(building.id) && (
                        <Line
                          key={building.id}
                          type="monotone"
                          dataKey={building.id}
                          stroke={building.color}
                          strokeWidth={1}
                          dot={false}
                          name={building.name}
                        />
                      )
                    )}
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={getDataByTimePeriod(selectedTimePeriod)} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      domain={[0, selectedTimePeriod === 'yearly' ? 20000000 : selectedTimePeriod === 'monthly' ? 1500000 : 50000]}
                      ticks={
                        selectedTimePeriod === 'yearly' 
                          ? [0, 5000000, 10000000, 15000000, 20000000]
                          : selectedTimePeriod === 'monthly'
                          ? [0, 300000, 600000, 900000, 1200000, 1500000]
                          : [0, 10000, 20000, 30000, 40000, 50000]
                      }
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    {BUILDINGS.map(building => 
                      selectedBuildings.includes(building.id) && (
                        <Bar
                          key={building.id}
                          dataKey={building.id}
                          fill={building.color}
                          name={building.name}
                          radius={[4, 4, 0, 0]}
                        />
                      )
                    )}
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Energy Usage Table */}
            <div className="bg-white rounded-2xl w-full border border-gray-200">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl">รายงานการใช้พลังงานไฟฟ้า (Wh)</h2>
                <div className="flex items-center gap-2">
                 
                  {/* Table Time Period Dropdown */}
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                      <span className="text-sm">{TIME_PERIODS.find(p => p.value === tableTimePeriod)?.label}</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-1" align="end">
                      <div className="py-1">
                        {TIME_PERIODS.map((period) => (
                          <button
                            key={period.value}
                            onClick={() => setTableTimePeriod(period.value)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded"
                          >
                            {period.label}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Table Date Selector */}
                  <Popover open={tableCalendarOpen} onOpenChange={setTableCalendarOpen}>
                    <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{tableSelectedDate}</span>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <input
                        type="date"
                        value={tableSelectedDate}
                        onChange={(e) => {
                          setTableSelectedDate(e.target.value);
                          setTableCalendarOpen(false);
                        }}
                        className="p-2 border-0 focus:outline-none"
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Building Selection Filter */}
                  <Popover open={buildingSelectionOpen} onOpenChange={setBuildingSelectionOpen}>
                    <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                      <FilterIcon />
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-1" align="end">
                      <div className="py-1">
                        {BUILDINGS.map((building) => (
                          <label 
                            key={building.id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                          >
                            <input
                              type="checkbox"
                              checked={tableSelectedBuildings.includes(building.name)}
                              onChange={() => handleTableBuildingSelection(building.name)}
                              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm">{building.name}</span>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Export Dropdown */}
                  <Popover>
                    <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path></svg>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-1" align="end">
                      <div className="py-1">
                        <button
                          onClick={() => exportToPDF(ALL_BUILDING_DATA, TIME_SLOTS)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded"
                        >
                          ส่งออกไฟล์ PDF
                        </button>
                        <button
                          onClick={() => exportToExcel(ALL_BUILDING_DATA, TIME_SLOTS)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded"
                        >
                          ส่งออกไฟล์ XLS
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>

            
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-10 px-4 py-2 bg-gray-50">
                <div className="text-gray-600">ชั้น</div>
                {TIME_SLOTS.map(time => (
                  <div key={time} className="text-center text-gray-600">{time}</div>
                ))}
              </div>

              {/* Table Content */}
              <div className="flex flex-col">
                {Object.entries(ALL_BUILDING_DATA)
                  .filter(([building]) => tableSelectedBuildings.includes(building))
                  .map(([building, data]) => (
                    <div key={building}>
                      <button
                        onClick={() => toggleTableBuilding(building)}
                        className="w-full grid grid-cols-10 items-center px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <div className="flex items-center text-indigo-600 font-medium">
                          {building}
                        </div>
                        <div className="col-span-8"></div>
                        <div className="flex justify-end">
                          <ChevronIcon isUp={tableExpandedBuildings[building]} />
                        </div>
                      </button>

                      <div 
                        className={`transition-all duration-300 overflow-hidden ${
                          tableExpandedBuildings[building] ? 'h-auto opacity-100' : 'h-0 opacity-0'
                        }`}
                      >
                        {data.floors.map((floor) => (
                          <div key={floor} className="grid grid-cols-10 px-4 py-3 border-b hover:bg-gray-50">
                            <div className="text-gray-600 pl-4">{floor}</div>
                            {data.values[floor].map((value, index) => (
                              <div key={index} className="text-center">
                                {value.toLocaleString()}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          // Solar Cell Content
          <div>Solar Cell Content</div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;