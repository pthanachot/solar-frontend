"use client";

import Tabs from "@/components/tabs";
import React, { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import Image from "next/image";
import { SelectOption } from "@/types/control";
import DropdownSkeleton from "@/components/form/dropdownSkeleton";
import DropdownError from "@/components/form/dropdownError";
import DropdownNotFound from "@/components/form/dropdownNotFound";
import { Switch } from "@/components/ui/switch";
import { Card } from '@/components/ui/card';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';


const powerData = [
  { name: '', value: 0 },
  { name: 'Room 1', value: 14000 },
  { name: 'Room 2', value: 1000 },
  { name: 'Room 3', value: 11000 },
  { name: 'Room 4', value: 1000 },
  { name: 'Room 5', value: 7500 },
  { name: '', value: 0 }
];

const energyData = [
  { name: '', value: 0 },
  { name: 'Room 1', value: 14000 },
  { name: 'Room 2', value: 1000 },
  { name: 'Room 3', value: 11000 },
  { name: 'Room 4', value: 1000 },
  { name: 'Room 5', value: 7500 },
  { name: '', value: 0 }
];


const ChevronIcon: React.FC<ChevronIconProps> = ({ isUp }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    {isUp ? (
      <path d="M18 15l-6-6-6 6" />
    ) : (
      <path d="M6 9l6 6 6-6" />
    )}
  </svg>
);



interface Floor {
  id: string;
  name: string;
  isOn: boolean;
}

const ClockIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);






const ControlCenterPage = () => {
	const {
		data: building,
		loading: buildingLoading,
		error: buildingError,
	} = useFetch<SelectOption[]>("/control/building");

	const [expandedRooms, setExpandedRooms] = useState<ExpandedRooms>({
	    'Room 1': true,
	    'Room 2': true
	  });

	const toggleRoom = (room: string) => {
	    setExpandedRooms(prev => ({
	      ...prev,
	      [room]: !prev[room]
	    }));
	  };

    // ข้อมูลห้อง Section สุดท้ายที่เป็นตาราง
	const rooms: RoomData = {
	    'Room 1': [
	      { id: 'L1', current: '1,000 W', total: '1,000 Wh' },
	      { id: 'L2', current: '14,000 W', total: '14,000 Wh' },
	      { id: 'L3', current: '1,000 W', total: '1,000 Wh' }
	    ],
	    'Room 2': [
	      { id: 'L1', current: '1,000 W', total: '1,000 Wh' },
	      { id: 'L2', current: '14,000 W', total: '14,000 Wh' },
	      { id: 'L3', current: '0 W', total: '0 Wh' }
	    ]
	  };


	  const [selectedDate, setSelectedDate] = useState<string>('');
	  const [activePopover, setActivePopover] = useState<string | null>(null);

	  // เลือกเปิดปิดไฟในแต่ละห้อง
	  const [floors, setFloors] = useState<Floor[]>([
	    { id: 'floor1', name: 'Floor1', isOn: true },
	    { id: 'floor2', name: 'Floor2', isOn: false },
	  ]);

	  const handleSwitchChange = (floorId: string) => {
	    setFloors(prev => 
	      prev.map(floor => 
	        floor.id === floorId ? { ...floor, isOn: !floor.isOn } : floor
	      )
	    );
	  };

	  const togglePopover = (floorId: string) => {
	    setActivePopover(prev => prev === floorId ? null : floorId);
	  };

	  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	    setSelectedDate(e.target.value);
	  };


	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-between items-stretch">
				<div className="flex flex-col gap-2">
					<h1 className="text-[22px] font-medium">ศูนย์ควบคุม</h1>
					<div>ไฟฟ้าอาคาร 1</div>
					<Tabs />
				</div>
				<div className="flex flex-col items-end justify-between gap-4 flex-1">
					<Image src="/noti.svg" alt="notification" width={32} height={32} />
					<Select>
						<SelectTrigger className="w-[223px] rounded-full">
							<SelectValue placeholder="อาคาร 1" />
						</SelectTrigger>
						<SelectContent>
							{buildingLoading ? (
								<DropdownSkeleton />
							) : buildingError ? (
								<DropdownError />
							) : building?.length === 0 ? (
								<DropdownNotFound />
							) : (
								building?.map((item: SelectOption, index) => (
									<SelectItem key={index} value={item.id.toString()}>
										{item.name}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="flex rounded-3xl border border-table-border py-10 px-12 gap-60">
				<div className="flex flex-1">
					<div className="flex flex-col rounded-lg border border-title w-full h-[432px] overflow-hidden">
						<div className="flex flex-1 justify-center items-center bg-g-linear">
							<div className="flex flex-col gap-4">
								<h1 className="flex font-medium text-[#5726EB]">Floor1</h1>
								<div className="flex flex-col">
									<div>L1 0.0V</div>
									<div>L2 0.0V</div>
									<div>L3 0.0V</div>
								</div>
							</div>
						</div>
						<div className="flex flex-1 justify-center items-center border-t border-title">
							<div className="flex flex-col gap-4">
								<h1 className="flex font-medium text-[#5726EB]">Floor2</h1>
								<div className="flex flex-col">
									<div>L1 0.0V</div>
									<div>L2 0.0V</div>
									<div>L3 0.0V</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="p-6">
			      <div className="flex flex-col gap-8">
			        {/* Legend */}
			        <div className="flex gap-8">
			          <span className="flex gap-2 items-center">
			            <div className="w-5 h-5 rounded-full bg-[#DADDFF]"></div>
			            <div>ไฟเปิดอยู่</div>
			          </span>
			          <span className="flex gap-2 items-center">
			            <div className="w-5 h-5 rounded-full bg-[#F2F2F2]"></div>
			            <div>ไฟปิดอยู่</div>
			          </span>
			        </div>

			        {/* Controls */}
			        <div className="flex gap-6 flex-col items-end">
			          {floors.map((floor) => (
			            <div key={floor.id} className="flex gap-3 items-center">
			              <div className="mr-10 font-medium">{floor.name}</div>
			              <Switch 
			                checked={floor.isOn} 
			                onCheckedChange={() => handleSwitchChange(floor.id)}
			              />
			              <div className="relative">
			                <button 
			                  onClick={() => togglePopover(floor.id)}
			                  className="p-1 hover:bg-gray-100 rounded-full"
			                  type="button"
			                >
			                  <ClockIcon />
			                </button>
			                
			                {activePopover === floor.id && (
			                  <div className="absolute right-0 mt-2 p-4 min-w-[300px] z-50 bg-white shadow-lg rounded-lg border">
			                    <div className="flex flex-col gap-4">
			                      <div className="text-gray-600">เลือกช่วงเวลาเปิดไฟอัตโนมัติ</div>
			                      <input 
			                        type="datetime-local" 
			                        className="border rounded-lg p-2"
			                        value={selectedDate}
			                        onChange={handleDateChange}
			                      />
			                    </div>
			                  </div>
			                )}
			              </div>
			            </div>
			          ))}
			        </div>
			      </div>
			    </div>
			</div>

			<div className="flex flex-col md:flex-row gap-8 w-full">
			      {/* Power Usage Chart */}
			      <div className="flex-1 p-6 rounded-3xl bg-white shadow-sm rounded-2xl border border-gray-200">
			        <h2 className="text-gray-500 text-sm mb-1">ค่าพลังงานที่ใช้ปัจจุบัน (W)</h2>
			        <div className="text-3xl font-medium mb-6">33,500 W</div>
			        <div className="h-64">
			          <ResponsiveContainer width="100%" height="100%">
			            <ComposedChart data={powerData}>
			              <defs>
			                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
			                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
			                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
			                </linearGradient>
			              </defs>
			              <CartesianGrid 
			                strokeDasharray="3 3" 
			                vertical={false}
			                stroke="#E5E7EB"
			              />
			              <XAxis 
			                dataKey="name" 
			                axisLine={false}
			                tickLine={false}
			                tick={{ fill: '#6B7280', fontSize: 12 }}
			                dy={8}
			              />
			              <YAxis 
			                axisLine={false}
			                tickLine={false}
			                tick={{ fill: '#6B7280', fontSize: 12 }}
			                domain={[0, 15000]}
			                ticks={[0, 2500, 5000, 7500, 10000, 12500, 15000]}
			              />
			              <Area
			                type="linear"
			                dataKey="value"
			                stroke="#8884d8"
			                strokeWidth={2}
			                fill="url(#powerGradient)"
			                dot={{ fill: '#8884d8', r: 4 }}
			              />
			            </ComposedChart>
			          </ResponsiveContainer>
			        </div>
			      </div>


			      {/* Energy Consumption Chart */}
			      <div className="flex-1 p-6 rounded-3xl bg-white shadow-sm rounded-2xl border border-gray-200">
			        <h2 className="text-gray-500 text-sm mb-1">ค่าพลังงานที่ใช้ทั้งหมด (Wh)</h2>
			        <div className="text-3xl font-medium mb-6">33,500 Wh</div>
			        <div className="h-64">
			          <ResponsiveContainer width="100%" height="100%">
			            <ComposedChart data={energyData}>
			              <defs>
			                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
			                  <stop offset="5%" stopColor="#FFA07A" stopOpacity={0.3}/>
			                  <stop offset="95%" stopColor="#FFA07A" stopOpacity={0}/>
			                </linearGradient>
			              </defs>
			              <CartesianGrid 
			                strokeDasharray="3 3" 
			                vertical={false}
			                stroke="#E5E7EB"
			              />
			              <XAxis 
			                dataKey="name" 
			                axisLine={false}
			                tickLine={false}
			                tick={{ fill: '#6B7280', fontSize: 12 }}
			                dy={8}
			              />
			              <YAxis 
			                axisLine={false}
			                tickLine={false}
			                tick={{ fill: '#6B7280', fontSize: 12 }}
			                domain={[0, 15000]}
			                ticks={[0, 2500, 5000, 7500, 10000, 12500, 15000]}
			              />
			              <Area
			                type="linear"
			                dataKey="value"
			                stroke="#FFA07A"
			                strokeWidth={2}
			                fill="url(#energyGradient)"
			                dot={{ fill: '#FFA07A', r: 4 }}
			              />
			            </ComposedChart>
			          </ResponsiveContainer>
			        </div>
			      </div>
			</div>

			 {/*PowerSourcesList Table*/}
			<div className="bg-white rounded-2xl w-full rounded-3xl border border-table-border">
			  <h1 className="text-xl font-normal mb-4 px-4 pt-6">แหล่งพลังงาน</h1>
			  
			  {/* Header */}
			  <div className="grid grid-cols-3 mb-2 px-8">
			    <div className="text-gray-600">แหล่งพลังงาน</div>
			    <div className="text-gray-600">ค่าพลังงานปัจจุบันที่วัดได้</div>
			    <div className="text-gray-600">ค่าพลังงานที่ใช้ทั้งหมด</div>
			  </div>

			  {/* Rooms */}
			  <div className="flex flex-col">
			    {Object.entries(rooms).map(([roomName, sources]) => (
			      <div key={roomName} className="mb-2">
			        <button
			          onClick={() => toggleRoom(roomName)}
			          className="w-full grid grid-cols-3 items-center px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors"
			        >
			          <div className="flex items-center text-indigo-600 font-medium px-2">
			            {roomName}
			          </div>
			          <div></div>
			          <div className="flex justify-end ">
			            {expandedRooms[roomName] ? <ChevronIcon isUp={true} /> : <ChevronIcon isUp={false} />}
			          </div>
			        </button>

			        {/* Collapsible Section */}
			        <div 
			          className={`grid transition-all duration-300 overflow-hidden px-6 ${
			            expandedRooms[roomName] ? 'h-auto opacity-100' : 'h-0 opacity-0'
			          }`}
			        >
			          {sources.map((source) => (
			            <div key={source.id} className="grid grid-cols-3 px-4 py-3 border-b">
			              <div className="text-gray-600">{source.id}</div>
			              <div>{source.current}</div>
			              <div>{source.total}</div>
			            </div>
			          ))}
			        </div>
			      </div>
			    ))}
			  </div>
			</div>

		</div>
	);
};

export default ControlCenterPage;
