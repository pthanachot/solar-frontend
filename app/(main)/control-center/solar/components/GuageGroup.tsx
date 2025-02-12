"use client";

import { Gauge } from "@/components/widgets/gauge";
import { formatTimestamp } from "@/utils/format";
import { useEffect, useState } from "react";
import GuageContainer from "./GuageContainer";

const GuageGroup = ({ url }: { url: string }) => {
	const [values, setValues] = useState({
		value1: { value: 0, lastUpdate: 0 },
		value2: { value: 0, lastUpdate: 0 },
		value3: { value: 0, lastUpdate: 0 },
		value4: { value: 0, lastUpdate: 0 },
		value5: { value: 0, lastUpdate: 0 },
		value6: { value: 0, lastUpdate: 0 },
		value7: { value: 0, lastUpdate: 0 },
		value8: { value: 0, lastUpdate: 0 },
		value9: { value: 0, lastUpdate: 0 },
		value10: { value: 0, lastUpdate: 0 },
		value11: { value: 0, lastUpdate: 0 },
		value12: { value: 0, lastUpdate: 0 },
		value13: { value: 0, lastUpdate: 0 },
		value14: { value: 0, lastUpdate: 0 },
		value15: { value: 0, lastUpdate: 0 },
		value16: { value: 0, lastUpdate: 0 },
		value17: { value: 0, lastUpdate: 0 },
		value18: { value: 0, lastUpdate: 0 },
		value19: { value: 0, lastUpdate: 0 },
		value20: { value: 0, lastUpdate: 0 },
		value21: { value: 0, lastUpdate: 0 },
		value22: { value: 0, lastUpdate: 0 },
		value23: { value: 0, lastUpdate: 0 },
		value24: { value: 0, lastUpdate: 0 },
		value25: { value: 0, lastUpdate: 0 },
		value26: { value: 0, lastUpdate: 0 },
		value27: { value: 0, lastUpdate: 0 },
		value28: { value: 0, lastUpdate: 0 },
	});

	useEffect(() => {
		const eventSource = new EventSource(url);

		eventSource.addEventListener("value1", (event) => {
			setValues((prev) => ({
				...prev,
				value1: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});

		eventSource.addEventListener("value2", (event) => {
			setValues((prev) => ({
				...prev,
				value2: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});

		eventSource.addEventListener("value3", (event) => {
			setValues((prev) => ({
				...prev,
				value3: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});

		eventSource.addEventListener("value4", (event) => {
			setValues((prev) => ({
				...prev,
				value4: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value5", (event) => {
			setValues((prev) => ({
				...prev,
				value5: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value6", (event) => {
			setValues((prev) => ({
				...prev,
				value6: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value7", (event) => {
			setValues((prev) => ({
				...prev,
				value7: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value8", (event) => {
			setValues((prev) => ({
				...prev,
				value8: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value9", (event) => {
			setValues((prev) => ({
				...prev,
				value9: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value10", (event) => {
			setValues((prev) => ({
				...prev,
				value10: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value11", (event) => {
			setValues((prev) => ({
				...prev,
				value11: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value12", (event) => {
			setValues((prev) => ({
				...prev,
				value12: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value13", (event) => {
			setValues((prev) => ({
				...prev,
				value13: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value14", (event) => {
			setValues((prev) => ({
				...prev,
				value14: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value15", (event) => {
			setValues((prev) => ({
				...prev,
				value15: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value16", (event) => {
			setValues((prev) => ({
				...prev,
				value16: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value17", (event) => {
			setValues((prev) => ({
				...prev,
				value17: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value18", (event) => {
			setValues((prev) => ({
				...prev,
				value18: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value19", (event) => {
			setValues((prev) => ({
				...prev,
				value19: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value20", (event) => {
			setValues((prev) => ({
				...prev,
				value20: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value21", (event) => {
			setValues((prev) => ({
				...prev,
				value21: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value22", (event) => {
			setValues((prev) => ({
				...prev,
				value22: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value23", (event) => {
			setValues((prev) => ({
				...prev,
				value23: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value24", (event) => {
			setValues((prev) => ({
				...prev,
				value24: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value25", (event) => {
			setValues((prev) => ({
				...prev,
				value25: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value26", (event) => {
			setValues((prev) => ({
				...prev,
				value26: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value27", (event) => {
			setValues((prev) => ({
				...prev,
				value27: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});
		eventSource.addEventListener("value28", (event) => {
			setValues((prev) => ({
				...prev,
				value28: { value: parseFloat(event.data), lastUpdate: Date.now() },
			}));
		});

		eventSource.onerror = () => {
			console.error("SSE connection error");
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, []);
	return (
		<div className="grid grid-cols-4 gap-6">
			{/* <div>
				<h1>Real-Time Dashboard (Independent Updates)</h1>
				<ul>
					<li>Value 1: {values.value1.toFixed(2)}</li>
					<li>Value 2: {values.value2.toFixed(2)}</li>
					<li>Value 3: {values.value3.toFixed(2)}</li>
					<li>Value 4: {values.value4.toFixed(2)}</li>
				</ul>
			</div> */}
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน DC 1"
					units="โวลต์"
					max={1000}
					data={{ value: values.value1.value, time: values.value1.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน DC 2"
					units="โวลต์"
					max={1000}
					data={{ value: values.value2.value, time: values.value2.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน DC 3"
					units="โวลต์"
					max={1000}
					data={{ value: values.value3.value, time: values.value3.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส DC 1"
					units="แอมป์"
					max={100}
					data={{ value: values.value4.value, time: values.value4.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส DC 2"
					units="แอมป์"
					max={100}
					data={{ value: values.value5.value, time: values.value5.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส DC 3"
					units="แอมป์"
					max={100}
					data={{ value: values.value6.value, time: values.value6.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน AC 1"
					units="โวลต์"
					max={1000}
					data={{ value: values.value7.value, time: values.value7.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน AC 2"
					units="โวลต์"
					max={1000}
					data={{ value: values.value8.value, time: values.value8.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน AC 3"
					units="โวลต์"
					max={1000}
					data={{ value: values.value9.value, time: values.value9.lastUpdate }}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส AC 1"
					units="แอมป์"
					max={100}
					data={{
						value: values.value10.value,
						time: values.value10.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส AC 2"
					units="แอมป์"
					max={100}
					data={{
						value: values.value11.value,
						time: values.value11.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส AC 3"
					units="แอมป์"
					max={100}
					data={{
						value: values.value12.value,
						time: values.value12.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="Power Comsumption"
					units="วัตต์"
					max={55000}
					data={{
						value: values.value13.value,
						time: values.value13.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="temperature"
					label="อุณหภูมิเครื่อง"
					units="องศาเซลเซียส"
					max={100}
					data={{
						value: values.value14.value,
						time: values.value14.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน DC 1 (2)"
					units="โวลต์"
					max={1000}
					data={{
						value: values.value15.value,
						time: values.value15.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน DC 2 (2)"
					units="โวลต์"
					max={1000}
					data={{
						value: values.value16.value,
						time: values.value16.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน DC 3 (2)"
					units="โวลต์"
					max={1000}
					data={{
						value: values.value17.value,
						time: values.value17.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส DC 1 (2)"
					units="แอมป์"
					max={100}
					data={{
						value: values.value18.value,
						time: values.value18.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส DC 2 (2)"
					units="แอมป์"
					max={100}
					data={{
						value: values.value19.value,
						time: values.value19.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส DC 3 (2)"
					units="แอมป์"
					max={100}
					data={{
						value: values.value20.value,
						time: values.value20.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน AC 1 (2)"
					units="โวลต์"
					max={1000}
					data={{
						value: values.value21.value,
						time: values.value21.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน AC 2 (2)"
					units="โวลต์"
					max={1000}
					data={{
						value: values.value22.value,
						time: values.value22.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="voltageDC"
					label="แรงดัน AC 3 (2)"
					units="โวลต์"
					max={1000}
					data={{
						value: values.value23.value,
						time: values.value23.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส AC 1 (2)"
					units="แอมป์"
					max={100}
					data={{
						value: values.value24.value,
						time: values.value24.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส AC 2 (2)"
					units="แอมป์"
					max={100}
					data={{
						value: values.value25.value,
						time: values.value25.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="กระแส AC 3 (2)"
					units="แอมป์"
					max={100}
					data={{
						value: values.value26.value,
						time: values.value26.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="currentDC"
					label="Power Comsumption (2)"
					units="วัตต์"
					max={55000}
					data={{
						value: values.value27.value,
						time: values.value27.lastUpdate,
					}}
				/>
			</GuageContainer>
			<GuageContainer>
				<Gauge
					handleRefresh={() => {}}
					type="temperature"
					label="อุณหภูมิเครื่อง (2)"
					units="องศาเซลเซียส"
					max={100}
					data={{
						value: values.value28.value,
						time: values.value28.lastUpdate,
					}}
				/>
			</GuageContainer>
		</div>
	);
};

export default GuageGroup;
