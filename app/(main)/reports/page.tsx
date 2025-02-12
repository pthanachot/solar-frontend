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
  ResponsiveContainer
} from 'recharts';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


interface DataPoint {
  time: string;
  building1: number;
  building2: number;
  building3: number;
}

interface Building {
  id: string;
  name: string;
}


// Data for graphs
const data: DataPoint[] = [
  { time: '0:00', building1: 6000, building2: 6500, building3: 0 },
  { time: '2:00', building1: 15000, building2: 12500, building3: 7500 },
  { time: '4:00', building1: 10000, building2: 5000, building3: 5000 },
  { time: '6:00', building1: 2500, building2: 0, building3: 2500 },
  { time: '8:00', building1: 0, building2: 2500, building3: 0 },
  { time: '10:00', building1: 2500, building2: 7500, building3: 5000 },
  { time: '12:00', building1: 7500, building2: 2500, building3: 10000 },
  { time: '14:00', building1: 10000, building2: 0, building3: 7500 },
  { time: '16:00', building1: 5000, building2: 2500, building3: 5000 },
  { time: '18:00', building1: 0, building2: 5000, building3: 2500 },
  { time: '20:00', building1: 2500, building2: 0, building3: 7500 },
  { time: '22:00', building1: 5000, building2: 6500, building3: 12500 },
  { time: '24:00', building1: 0, building2: 0, building3: 0 },
];

const buildings: Building[] = [
  { id: 'building1', name: 'อาคาร 1' },
  { id: 'building2', name: 'อาคาร 2' },
  { id: 'building3', name: 'อาคาร 3' },
  { id: 'building4', name: 'อาคาร 4' },
  { id: 'building5', name: 'อาคาร 5' },
];





// Interfaces
interface BuildingFloor {
  values: number[];
  floors: string[];
}

interface BuildingData {
  [key: string]: BuildingFloor;
}

interface ExpandedBuildings {
  [key: string]: boolean;
}

// SVG Icon Components
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

const CalendarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const FilterIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);



const ReportsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'building';

  const handleTypeChange = (newType: string) => {
    router.push(`/reports?type=${newType}`);
  };

  const [selectedBuildings, setSelectedBuildings] = useState<string[]>(['building1', 'building2', 'building3']);
  const [selectedDate, setSelectedDate] = useState<string>('2024-12-21');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setIsCalendarOpen(false); // Close the popover after date selection
  };


  const [expandedBuildings, setExpandedBuildings] = useState<ExpandedBuildings>({
    'อาคาร 1': true,
    'อาคาร 2': true
  });
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeSlots: string[] = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'];
  
  const buildingData: BuildingData = {
    'อาคาร 1': {
      floors: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3'],
      values: Array(8).fill(1000)
    },
    'อาคาร 2': {
      floors: ['ชั้น 1', 'ชั้น 2', 'ชั้น 3', 'ชั้น 4'],
      values: Array(8).fill(1000)
    }
  };



  // This is for table


 const [tableSelectedDate, setTableSelectedDate] = useState('2024-12-21');
  const [tableCalendarOpen, setTableCalendarOpen] = useState(false);
  const [buildingSelectionOpen, setBuildingSelectionOpen] = useState(false);
  const [tableSelectedBuildings, setTableSelectedBuildings] = useState([
    'อาคาร 1',
    'อาคาร 2'
  ]);
  const [tableExpandedBuildings, setTableExpandedBuildings] = useState({
    'อาคาร 1': true,
    'อาคาร 2': true
  });

  const tableTimeSlots = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00'];

  const buildings = [
    'อาคาร 1',
    'อาคาร 2',
    'อาคาร 3',
    'อาคาร 4',
    'อาคาร 5'
  ];

  // Data for Table!!
  const allBuildingData = {
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

  const handleTableBuildingSelection = (building) => {
    setTableSelectedBuildings(prev => {
      const newSelection = prev.includes(building)
        ? prev.filter(b => b !== building)
        : [...prev, building];
      
      // Update expanded state when adding new building
      if (!prev.includes(building)) {
        setTableExpandedBuildings(prevExpanded => ({
          ...prevExpanded,
          [building]: true
        }));
      }
      
      return newSelection;
    });
  };

  const toggleTableBuilding = (building) => {
    setTableExpandedBuildings(prev => ({
      ...prev,
      [building]: !prev[building]
    }));
  };



// useEffect

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleBuilding = (building: string): void => {
    setExpandedBuildings(prev => ({
      ...prev,
      [building]: !prev[building]
    }));
  };

  interface ExportData {
    Building: string;
    Floor: string;
    [key: string]: string | number;
  }

  const prepareExportData = (): ExportData[] => {
    const data: ExportData[] = [];
    Object.entries(buildingData).forEach(([building, buildingInfo]) => {
      buildingInfo.floors.forEach((floor) => {
        const row: ExportData = {
          'Building': building,
          'Floor': floor,
        };
        timeSlots.forEach((time, index) => {
          row[time] = buildingInfo.values[index];
        });
        data.push(row);
      });
    });
    return data;
  };

  const exportToExcel = (): void => {
    const data = prepareExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Power Usage Report");
    XLSX.writeFile(wb, "power_usage_report.xlsx");
    setShowExportMenu(false);
  };

  const exportToPDF = (): void => {
    const doc = new jsPDF();
    const data = prepareExportData();
    
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
    setShowExportMenu(false);
  };





  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">รายงานแสดงผล</h1>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <div className="w-5 h-5">
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
          </div>
        </button>
      </div>
      
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

      {/* Content section based on type */}
      <div className="mt-6">

        {/* Default Building*/}
        {type === 'building' ? (
          <div>

           <div className="w-full h-96 p-4 bg-white rounded-2xl w-full border border-gray-200 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">การใช้พลังงานของอาคาร (ยูนิต)</h2>
              <div className="flex items-center gap-4">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedDate}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="p-2 border-0 focus:outline-none"
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger className="px-4 py-2 text-sm border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                    รายชั่วโมง
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </PopoverTrigger>
                  <PopoverContent className="w-48" align="end">
                    <div className="flex flex-col">
                      {Object.entries(allBuildingData)
                        .filter(([building]) => tableSelectedBuildings.includes(building))
                        .map(([building, data]) => (
                          <div key={building}>
                            <button
                              onClick={() => toggleBuilding(building)}
                              className="w-full grid grid-cols-10 items-center px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                              <div className="flex items-center text-indigo-600 font-medium">
                                {building}
                              </div>
                              <div className="col-span-8"></div>
                              <div className="flex justify-end">
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
                                  {expandedBuildings[building] ? (
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                  ) : (
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                  )}
                                </svg>
                              </div>
                            </button>

                            <div 
                              className={`transition-all duration-300 overflow-hidden ${
                                expandedBuildings[building] ? 'h-auto opacity-100' : 'h-0 opacity-0'
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
                  </PopoverContent>
                </Popover>
                
                <button className="p-2 border rounded-lg hover:bg-gray-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={data}>
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
                {selectedBuildings.includes('building1') && (
                  <Line
                    type="monotone"
                    dataKey="building1"
                    stroke="#855DFE"
                    strokeWidth={1}
                    dot={false}
                    name="อาคาร 1"
                  />
                )}
                {selectedBuildings.includes('building2') && (
                  <Line
                    type="monotone"
                    dataKey="building2"
                    stroke="#F9A340"
                    strokeWidth={1}
                    dot={false}
                    name="อาคาร 2"
                  />
                )}
                {selectedBuildings.includes('building3') && (
                  <Line
                    type="monotone"
                    dataKey="building3"
                    stroke="#37E3BB"
                    strokeWidth={1}
                    dot={false}
                    name="อาคาร 3"
                  />
                )}
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>


           {/* Table to show รายงานการใช้ไฟฟ้า */}
             <div className="bg-white rounded-2xl w-full rounded-3xl border border-gray-200">
                {/* Header with controls */}
                <div className="flex justify-between items-center p-4">
                  <h1 className="text-xl">รายงานการใช้พลังงานไฟฟ้า (Wh)</h1>
                  <div className="flex items-center gap-2">
                    {/* Calendar Popover */}
                    <Popover open={tableCalendarOpen} onOpenChange={setTableCalendarOpen}>
                      <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                        <Calendar className="w-4 h-4" />
                        <span>{tableSelectedDate}</span>
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

                    {/* Building Selection Dropdown */}
                    <Popover open={buildingSelectionOpen} onOpenChange={setBuildingSelectionOpen}>
                      <PopoverTrigger className="flex items-center gap-2 px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                        <span>รายชั่วโมง</span>
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
                          className={`transform transition-transform ${buildingSelectionOpen ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-1" align="end">
                        <div className="py-1">
                          {buildings.map((building) => (
                            <label 
                              key={building}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded"
                            >
                              <input
                                type="checkbox"
                                checked={tableSelectedBuildings.includes(building)}
                                onChange={() => handleTableBuildingSelection(building)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-sm">{building}</span>
                            </label>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Filter Button */}
                    <button className="p-2 border rounded-lg hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-10 px-4 py-2 bg-gray-50">
                  <div className="text-gray-600">ชั้น</div>
                  {tableTimeSlots.map(time => (
                    <div key={time} className="text-center text-gray-600">{time}</div>
                  ))}
                </div>

                {/* Buildings */}
                <div className="flex flex-col">
                  {Object.entries(allBuildingData)
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
                              {tableExpandedBuildings[building] ? (
                                <polyline points="18 15 12 9 6 15"></polyline>
                              ) : (
                                <polyline points="6 9 12 15 18 9"></polyline>
                              )}
                            </svg>
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
        

        // Solar Cell
          <div>Solar Cell Content</div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;