import { getDaysNumberInMonth, isWeekend } from '../services/functions';

// Get reports by days excel columns
export const getDaysColumns = (year: number, month: number) =>
  new Array(getDaysNumberInMonth(month)).fill(true).map((_, index): any => {
    const date = new Date();
    date.setFullYear(year, month, index + 1);
    return {
      name: index + 1,
      width: 5,
      isWeekend: isWeekend(date),
    };
  });

// Location check results columns
export const getLocationCheckResultsColumns = (): any => [
  { name: 'Имя', width: 25 },
  { name: 'Номер телефона', width: 25 },
  { name: 'Идентификационный код', width: 25 },
  { name: 'Должность', width: 25 },
  { name: 'Местоположение', width: 25 },
  { name: 'На работе', width: 25 },
];

// Work shifts actions columns
export const getWorkShiftsActionsColumns = (): any => [
  { name: 'Телефон', width: 20 },
  { name: 'Організація', width: 20 },
  { name: 'ІПН', width: 20 },
  { name: 'ПІБ', width: 20 },
  { name: 'Посада', width: 20 },
  { name: 'Ставка за годину', width: 15 },
  { name: "Об'єкт", width: 25 },
  { name: 'Геолокація', width: 25 },
  { name: 'Дія', width: 15 },
  { name: 'Дата, час', width: 30 },
  { name: 'Автомобіль', width: 15 },
  { name: 'Відрядження', width: 12 },
];

// Reports by days columns
export const getReportsByDaysColumns = (year: number, month: number): any => [
  { name: 'Телефон', width: 20 },
  { name: 'Організація', width: 20 },
  { name: 'ІПН', width: 20 },
  { name: 'ПІБ', width: 20 },
  { name: 'Посада', width: 20 },
  { name: 'Ставка за годину', width: 15 },
  { name: "Об'єкт", width: 25 },
  { name: null, width: 15 },
  ...getDaysColumns(year, month),
  { name: null, width: 15 },
  { name: 'Сума годин', width: 12 },
  { name: 'Відрядження', width: 12 },
  { name: 'Зарплата', width: 12 },
  { name: "Відрядження (разом за всіма об'єктами)", width: 20 },
  { name: "Зарплата (разом за всіма об'єктами)", width: 20 },
  { name: "Автомобіль (кіл-ть днів разом за всіма об'єктами)", width: 20 },
  { name: 'Аванс 1', width: 12 },
  { name: 'Аванс 2', width: 12 },
  { name: 'Відпускні', width: 12 },
  { name: 'Премія', width: 12 },
  { name: 'Штраф', width: 12 },
];

// Reports by employees columns
export const getReportsByEmployeesColumns = (): any => [
  { name: 'Телефон', width: 20 },
  { name: 'Організація', width: 20 },
  { name: 'ІПН', width: 20 },
  { name: 'ПІБ', width: 20 },
  { name: 'Посада', width: 20 },
  { name: 'Ставка за годину', width: 15 },
  { name: 'Сума годин', width: 12 },
  { name: 'Відрядження', width: 12 },
  { name: 'Зарплата', width: 12 },
  { name: 'Автомобіль (кіл-ть днів)', width: 20 },
  { name: 'Автомобіль (сума грн.)', width: 20 },
  { name: 'Аванс 1', width: 12 },
  { name: 'Аванс 2', width: 12 },
  { name: 'Відпускні', width: 12 },
  { name: 'Премія', width: 12 },
  { name: 'Штраф', width: 12 },
];

// Reports by employee columns
export const getReportsByEmployeeColumns = (year: number, month: number): any => [
  { name: "Об'єкт", width: 25 },
  { name: null, width: 15 },
  ...getDaysColumns(year, month),
  { name: null, width: 15 },
  { name: 'Сума годин', width: 12 },
  { name: 'Відрядження', width: 12 },
  { name: 'Зарплата', width: 12 },
  { name: 'Аванс 1', width: 12 },
  { name: 'Аванс 2', width: 12 },
  { name: 'Відпускні', width: 12 },
  { name: 'Премія', width: 12 },
  { name: 'Штраф', width: 12 },
];

// Reports by objects columns
export const getReportsByObjectsColumns = (): any => [
  { name: "Об'єкт", width: 25 },
  { name: 'Сума годин', width: 15 },
  { name: 'Сума зарплат', width: 15 },
  { name: 'Сума відряджень', width: 15 },
  { name: 'Виконроб', width: 15 },
];

// Stats work shifts actions columns
export const getStatsWorkShiftsActionsColumns = (): any => [
  { name: 'Виконроб', width: 15 },
  { name: 'Сьогодні відкрило зміну', width: 25 },
  { name: 'Сьогодні закрило зміну', width: 25 },
];

export const getTotalClothingColumns = (): any => [
  { name: 'Розмір одягу', width: 12 },
  { name: 'Кількість', width: 12 },
];

export const getTotalShoeColumns = (): any => [
  { name: 'Розмір взуття', width: 12 },
  { name: 'Кількість', width: 12 },
];

export const getAppealsColumns = (): any => [
  { name: 'Примітка', width: 30 },
  { name: 'Телефон', width: 20 },
  { name: 'ПІБ', width: 20 },
  { name: 'Дата створення', width: 15 },
];

export const getClothingColumns = (): any => [
  { name: 'ПІБ', width: 20 },
  { name: 'Розмір одягу', width: 12 },
  { name: 'Розмір взуття', width: 12 },
];