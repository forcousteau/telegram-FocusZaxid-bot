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

//Get report by day for car

export const getCarDaysColumns = (year: number, month: number) =>
  new Array(getDaysNumberInMonth(month)).fill(true).flatMap((_, index): any => {
    const date = new Date();
    date.setFullYear(year, month, index + 1);
    return [{
      name: index + 1,
      width: 8,
      isWeekend: isWeekend(date),
    },{
      name: '',
      width: 8,
      isWeekend: isWeekend(date),
    }];
  });

// Location check results columns
export const getLocationCheckResultsColumns = (): any => [
  { isWeekend: false, name: 'Имя', width: 25 },
  { isWeekend: false, name: 'Номер телефона', width: 25 },
  { isWeekend: false, name: 'Идентификационный код', width: 25 },
  { isWeekend: false, name: 'Должность', width: 25 },
  { isWeekend: false, name: 'Местоположение', width: 25 },
  { isWeekend: false, name: 'На работе', width: 25 },
];

// Work shifts actions columns
export const getWorkShiftsActionsColumns = (): any => [
  { isWeekend: false, name: 'Телефон', width: 20 },
  { isWeekend: false, name: 'Організація', width: 20 },
  { isWeekend: false, name: 'ІПН', width: 20 },
  { isWeekend: false, name: 'ПІБ', width: 20 },
  { isWeekend: false, name: 'Посада', width: 20 },
  { isWeekend: false, name: 'Ставка за годину', width: 15 },
  { isWeekend: false, name: "Об'єкт", width: 25 },
  { isWeekend: false, name: 'Геолокація', width: 25 },
  { isWeekend: false, name: 'Дія', width: 15 },
  { isWeekend: false, name: 'Дата, час', width: 30 },
  { isWeekend: false, name: 'На якому Авто', width: 20 },
  { isWeekend: false, name: 'Відрядження', width: 30 },
];

// Reports by days columns
export const getReportsByDaysColumns = (year: number, month: number): any => [
  { isWeekend: false, name: 'Телефон', width: 20 },
  { isWeekend: false, name: 'Організація', width: 20 },
  { isWeekend: false, name: 'ІПН', width: 20 },
  { isWeekend: false, name: 'ПІБ', width: 20 },
  { isWeekend: false, name: 'Посада', width: 20 },
  { isWeekend: false, name: 'Ставка за годину', width: 15 },
  { isWeekend: false, name: "Об'єкт", width: 25 },
  { isWeekend: false, name: '', width: 15 },
  ...getDaysColumns(year, month),
  { isWeekend: false, name: '', width: 15 },
  { isWeekend: false, name: 'Сума годин', width: 12 },
  { isWeekend: false, name: 'Відрядження', width: 12 },
  { isWeekend: false, name: 'Зарплата', width: 12 },
  { isWeekend: false, name: 'За доїзд', width: 12 },
  { isWeekend: false, name: "Відрядження (разом за всіма об'єктами)", width: 20 },
  { isWeekend: false, name: 'Зарплата (разом за всіма об\'єктами)', width: 20 },
  { isWeekend: false, name: 'За доїзд разом', width: 20 },
  { isWeekend: false, name: 'Аванс 1', width: 12 },
  { isWeekend: false, name: 'Аванс 2', width: 12 },
  { isWeekend: false, name: 'Відпускні', width: 12 },
  { isWeekend: false, name: 'Премія', width: 12 },
  { isWeekend: false, name: 'Штраф', width: 12 },
];

// Reports by employees columns
export const getReportsByEmployeesColumns = (): any => [
  { isWeekend: false, name: 'Телефон', width: 20 },
  { isWeekend: false, name: 'Організація', width: 20 },
  { isWeekend: false, name: 'ІПН', width: 20 },
  { isWeekend: false, name: 'ПІБ', width: 20 },
  { isWeekend: false, name: 'Посада', width: 20 },
  { isWeekend: false, name: 'Ставка за годину', width: 15 },
  { isWeekend: false, name: 'Сума годин', width: 12 },
  { isWeekend: false, name: 'За доїзд	', with: 12},
  { isWeekend: false, name: 'Відрядження', width: 12},
  { isWeekend: false, name: 'Зарплата', width: 12 },
  { isWeekend: false, name: 'Повна ЗП', width: 12 },
  { isWeekend: false, name: 'Аванс 1', width: 12 },
  { isWeekend: false, name: 'Аванс 2', width: 12 },
  { isWeekend: false, name: 'Відпускні', width: 12 },
  { isWeekend: false, name: 'Премія', width: 12 },
  { isWeekend: false, name: 'Штраф', width: 12 },
  { isWeekend: false, name: 'До Оплати', width: 12}
];

// Reports by employee columns
export const getReportsByEmployeeColumns = (year: number, month: number): any => [
  { isWeekend: false, name: "Об'єкт", width: 25 },
  { isWeekend: false, name: '', width: 15 },
  ...getDaysColumns(year, month),
  { isWeekend: false, name: '', width: 15 },
  { isWeekend: false, name: 'Сума годин', width: 12 },
  { isWeekend: false, name: 'За доїзд', width: 12},
  { isWeekend: false, name: 'Відрядження', width: 12 },
  { isWeekend: false, name: 'Зарплата', width: 12 },
  { isWeekend: false, name: 'Повна ЗП', width: 12 },
  { isWeekend: false, name: 'Аванс 1', width: 12 },
  { isWeekend: false, name: 'Аванс 2', width: 12 },
  { isWeekend: false, name: 'Відпускні', width: 12 },
  { isWeekend: false, name: 'Премія', width: 12 },
  { isWeekend: false, name: 'Штраф', width: 12 },
  { isWeekend: false, name: 'До Оплати', width: 12 },
];

// Reports by objects columns
export const getReportsByObjectsColumns = (): any => [
  { isWeekend: false, name: "Об'єкт", width: 25 },
  { isWeekend: false, name: 'Сума годин', width: 15 },
  { isWeekend: false, name: 'Сума зарплат', width: 15 },
  { isWeekend: false, name: 'Сума за доїзд', width: 15},
  { isWeekend: false, name: 'Загальна Сума', width: 15},
  { isWeekend: false, name: 'Сума відряджень', width: 15 },
  { isWeekend: false, name: 'Сума За Транспортні', width: 15},
  { isWeekend: false, name: 'Виконроб', width: 15 },
];

// Stats work shifts actions columns
export const getStatsWorkShiftsActionsColumns = (): any => [
  { isWeekend: false, name: 'Виконроб', width: 15 },
  { isWeekend: false, name: 'Сьогодні відкрило зміну', width: 25 },
  { isWeekend: false, name: 'Сьогодні закрило зміну', width: 25 },
];

export const getTotalClothingColumns = (): any => [
  { isWeekend: false, name: 'Розмір одягу', width: 12 },
  { isWeekend: false, name: 'Кількість', width: 12 },
];

export const getTotalShoeColumns = (): any => [
  { isWeekend: false, name: 'Розмір взуття', width: 12 },
  { isWeekend: false, name: 'Кількість', width: 12 },
];

export const getAppealsColumns = (): any => [
  { isWeekend: false, name: 'Примітка', width: 30 },
  { isWeekend: false, name: 'Телефон', width: 20 },
  { isWeekend: false, name: 'ПІБ', width: 20 },
  { isWeekend: false, name: 'Дата створення', width: 15 },
];

export const getClothingColumns = (): any => [
  { isWeekend: false, name: 'ПІБ', width: 20 },
  { isWeekend: false, name: 'Розмір одягу', width: 12 },
  { isWeekend: false, name: 'Розмір взуття', width: 12 },
];

export const getCarRecordsColumns = (year: number, month: number): any[] => [
  { isWeekend: false, name: "Назва авто", width: 25 },
  { isWeekend: false, name: 'Власність фірми', width: 12 },
  { isWeekend: false, name: 'Тип палива', width: 15 },
  { isWeekend: false, name: 'Розхід', width: 12},
  { isWeekend: false, name: '', width: 12 },
  ...getCarDaysColumns(year, month),
  { isWeekend: false, name: '', width: 12 },
  { isWeekend: false, name: 'Сума КМ', width: 12 },
  { isWeekend: false, name: 'В-сть аморт. грн', width: 12},
  { isWeekend: false, name: 'Вартість палива', width: 12 },
  { isWeekend: false, name: 'Сума пальне + аморт грн.', width: 20 },
];


export const cellsArray = ()=>{
  const alphabet = Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65));
  const ACells = alphabet.map(letter => 'A'+letter);
  const BCells = alphabet.slice(0, 15).map(letter => 'B'+letter);
  return [...alphabet.slice(5, 26), ...ACells, ...BCells];
}