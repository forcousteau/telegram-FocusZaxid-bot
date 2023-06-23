import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { Button, Col, Form, InputNumber, message, Modal, Row, Select, Space, Typography } from 'antd';

import { fetchInteractiveTable, updateAdditionalPayments, updateWorkingHours } from '../../../api/interactiveTable';
import { IInteractiveTable } from '../../../types/interactiveTable';
import { getMonthName, isWeekend, range } from '../../../helpers/functions';
import { useForm } from 'antd/lib/form/Form';

import '../../../styles/InteractiveTable.css';
import Loading from '../../Loading';

const InteractiveTable: React.FC = () => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<IInteractiveTable>();
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();

  const [modalVisible, setModalVisible] = useState(true);

  const [grid, setGrid] = useState<any[]>([[]]);
  const [cellProps, setCellProps] = useState<any[]>([]);
  const [mergeCells, setMergeCells] = useState<any[]>([]);

  const table = useRef<HotTable>(null);

  const now = new Date();
  const months = Array.from({ length: 12 }, (v, k) => k);

  useEffect(() => {
	if (year == null || month == null) {
	  return;
	}

	updateData().then(() => setModalVisible(false));
  }, [year, month]);

  const updateData = async () => {
    const tableInstance = table.current?.hotInstance.getInstance();
	const autoRowSizePlugin = tableInstance?.getPlugin('autoRowSize');
	const autoColSizePlugin = tableInstance?.getPlugin('autoColumnSize');
	const scrollToRow = autoRowSizePlugin?.getFirstVisibleRow();
	const scrollToCol = autoColSizePlugin?.getFirstVisibleColumn();

	setLoading(true);

	try {
	  const interactiveTable = await fetchInteractiveTable({ year, month });
	  setData(interactiveTable);

	  const grid = createTable(interactiveTable);
	  fillTable(grid, interactiveTable);
	}
	catch (err) {
	  console.error(err);
	  message.error('Не вдалось отримати таблицю');
	}
	finally {
	  setLoading(false);

	  const tableInstance = table.current?.hotInstance.getInstance();
	  // @ts-ignore
	  tableInstance?.scrollViewportTo(scrollToRow, scrollToCol);
	}
  };

  const onDateFormSubmit = async ({ year, month }) => {
    setYear(year);
    setMonth(month);
  };

  const createTable = (data: IInteractiveTable) => {
	const daysRange = range(1, data.days).map(num => num.toString());

	const grid = [
	  [
		...data.columnsBeforeWorkingHours,
		'',
		...daysRange,
		'',
		...data.columnsAfterWorkingHours,
		...data.additionalPayments.map(({ type }) => type)
	  ]
	];

	setGrid(grid);

	const colsProps: any[] = [];

	const columnsBeforeWorkingHoursWidths = [200, 100, 75, 80, 150, 80, 180];
	const columnsWorkingHoursWidth = 30;
	const columnsAfterWorkingHoursWidths = [70, 50, 70, 50, 70, 50];
	const columnsAdditionalPaymentsWidths = [50, 50, 50, 50, 60];

	let nextSectionEnd = data.columnsBeforeWorkingHours.length;

	let i = 0;

	while (i < nextSectionEnd) {
	  for (const rowIndex in data.employees) {
		colsProps.push({
		  row: +rowIndex,
		  col: i,
		  width: columnsBeforeWorkingHoursWidths[i],
		  readOnly: true
		});
	  }
	  i++;
	}

	for (const rowIndex in data.employees) {
	  colsProps.push({
		row: +rowIndex,
		col: i,
		readOnly: true
	  });
	}

	nextSectionEnd += daysRange.length + 1;
	i++;

	while (i < nextSectionEnd) {
	  const day = i - data.columnsBeforeWorkingHours.length;
	  const dayIndex = day - 1;

	  for (const [rowIndex, employee] of data.employees.entries()) {
		const workingHoursRecord = employee.recordsWorkingHours[dayIndex];
		if (workingHoursRecord?.wasChanged) {
		  colsProps.push({
			row: rowIndex + 1,
			col: i,
			className: 'htLeft htMiddle ChangedCell'
		  });
		}
	  }

	  colsProps.push({
		row: 0,
		col: i,
		width: columnsWorkingHoursWidth,
		className: 'htLeft htMiddle'.concat(isWeekend({ day, month, year }) ? ' WeekendCell' : ''),
		readOnly: true
	  });
	  i++;
	}

	for (const rowIndex in data.employees) {
	  colsProps.push({
		row: +rowIndex,
		col: i,
		readOnly: true
	  });
	}

	nextSectionEnd += data.columnsAfterWorkingHours.length + 1;
	i++;

	let col = 0;
	while (i < nextSectionEnd) {
	  for (const rowIndex in data.employees) {
		colsProps.push({
		  row: +rowIndex,
		  col: i,
		  width: columnsAfterWorkingHoursWidths[col],
		  readOnly: true
		});
	  }
	  i++;
	  col++;
	}

	nextSectionEnd += data.additionalPayments.length;

	col = 0;
	while (i < nextSectionEnd) {
	  colsProps.push({
		row: 0,
		col: i,
		width: columnsAdditionalPaymentsWidths[col],
		readOnly: true
	  });
	  i++;
	  col++;
	}

	setCellProps(colsProps);

	return grid;
  };

  const fillTable = (grid, data: IInteractiveTable) => {
	for (const employee of data.employees) {
	  grid.push([
		...employee.recordsBeforeWorkingHours,
		'',
		...employee.recordsWorkingHours.map(record => record?.value ?? ''),
		'',
		...employee.recordsAfterWorkingHours,
		...employee.recordsAdditionalPayments
	  ]);
	}
  };

  const onCellChange = async (changes) => {
	if (!changes || !data || year == null || month == null) {
	  return;
	}

	for (const [row, col, oldValue, newValue] of changes) {
	  if (row < 1 || newValue === '' || oldValue === newValue) {
		continue;
	  }

	  const employeeId = data.employees[row - 1]?.id;
	  const objectId = data.employees[row - 1]?.objectId;

	  if (!employeeId || !objectId) {
		continue;
	  }

	  message.loading('Оновлюємо дані', 1e5);

	  const columnsWorkingHours = {
	    start: data.columnsBeforeWorkingHours.length + 1,
		end: data.columnsBeforeWorkingHours.length + data.days
	  };
	  const columnsAdditionalPayments = {
		start: data.columnsBeforeWorkingHours.length + data.days + data.columnsAfterWorkingHours.length,
		end: data.columnsBeforeWorkingHours.length + data.days + data.columnsAfterWorkingHours.length + data.additionalPayments.length + 1
	  };

	  const shouldEditWorkingHours = col >= columnsWorkingHours.start && col <= columnsWorkingHours.end;
	  const shouldEditAdditionalPayments = col >= columnsAdditionalPayments.start && col <= columnsAdditionalPayments.end;

	  if (shouldEditWorkingHours) {
		const day = col - columnsWorkingHours.start + 1;
		const hours = +newValue.replaceAll(',', '.');

		if (isNaN(hours) || hours < 0) {
		  message.destroy();
		  message.warn('Неправильний формат. Дані не були змінені');
		  continue;
		}

		try {
		  const timestamp = new Date(year, month, day).getTime();
		  await updateWorkingHours({ employeeId, objectId, timestamp, hours });
		  message.destroy();
		  message.success('Дані оновлені!');
		}
		catch (err) {
		  message.destroy();
		  message.error('Не вдалось змінити значення');
		}
		finally {
		  updateData();
		}
	  }

	  if (shouldEditAdditionalPayments) {
		const type = col - columnsAdditionalPayments.start - 1;
		const sum = +newValue.replaceAll(',', '.');

		if (isNaN(sum) || sum < 0) {
		  message.destroy();
		  message.warn('Неправильний формат. Дані не були змінені');
		  continue;
		}

		try {
		  await updateAdditionalPayments({ employeeId, year, month, type, sum })
		  message.destroy();
		  message.success('Дані оновлені!');
		}
		catch (err) {
		  message.destroy();
		  message.error('Не вдалось змінити значення');
		}
		finally {
		  updateData();
		}
	  }
	}
  };

  const tableSize = {
	height: window.innerHeight * 0.85,
	width: window.innerWidth * 0.83
  };

  return (
	<div className="InteractiveTableContainer">
	  <Space size="small" direction="vertical">
		<Row align="middle">
		  <Space size="middle">
			<Col>
			  <Typography.Title level={3} style={{ margin: 0 }}>
				{/*{partner && partner.name}*/}
			  </Typography.Title>
			</Col>
		  </Space>
		</Row>

		<Modal
		  title="Оберіть місяць та рік"
		  okText="Продовжити"
		  okButtonProps={{ loading }}
		  cancelText="Відмінити"
		  destroyOnClose={true}
		  onOk={form.submit}
		  visible={modalVisible}
		  onCancel={() => setModalVisible(false)}
		>
		  <Form
			form={form}
			onFinish={onDateFormSubmit as any}
			labelCol={{ span: 7 }}
			labelAlign="left"
			initialValues={{
			  month: now.getMonth(),
			  year: now.getFullYear()
			}}
		  >
			<Form.Item
			  name="month"
			  label="Місяць"
			  rules={[
				{
				  required: true,
				  message: 'Необхідно обрати місяць!'
				}
			  ]}
			>
			  <Select placeholder="Оберіть місяць">
				{
				  months.map(month => (
					<Select.Option value={month} key={month}>
					  {getMonthName(month)}
					</Select.Option>
				  ))
				}
			  </Select>
			</Form.Item>

			<Form.Item
			  name="year"
			  label="Рік"
			  rules={[
				{
				  required: true,
				  message: 'Необхідно ввести рік!'
				}
			  ]}
			>
			  <InputNumber placeholder="Введіть рік" style={{ width: 120 }} min={2019}/>
			</Form.Item>
		  </Form>
		</Modal>

		{loading && <Loading />}

		{!loading && !!data && (
		  <>
			<Button
			  type="primary"
			  onClick={() => setModalVisible(true)}
			>
			  Обрати інший період
			</Button>

			<HotTable
			  ref={table}
			  data={grid}
			  cell={cellProps}
			  mergeCells={mergeCells}
			  className="htLeft htMiddle"
			  colHeaders
			  rowHeaders
			  manualColumnResize
			  manualRowResize
			  fixedRowsTop={1}
			  fixedColumnsLeft={1}
			  rowHeights={40}
			  height={tableSize.height}
			  viewportRowRenderingOffset={tableSize.height}
			  selectionMode="single"
			  fillHandle={false}
			  width={tableSize.width}
			  afterChange={loading ? () => {} : onCellChange}
			  style={{ height: '100%', fontSize: 11, overflow: 'hidden' }}
			/>
		  </>
		)}
	  </Space>
	</div>
  );
};

export default InteractiveTable;
