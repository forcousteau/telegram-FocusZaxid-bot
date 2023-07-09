const Queries = {
  select: {
    users: {
      all: 'select * from "telegramUsers"',
      byChatId: 'select * from "telegramUsers" where "chatId" = $1',
    },
    admins: {
      all: 'select * from "telegramUsers" where "isAdmin" = true',
      byChatId: 'select * from "telegramUsers" where "chatId" = $1 and "isAdmin" = true',
    },
    webadminsRoles: {
      all: 'select * from "webadminsRoles"',
      byUsername:
        'select "webadminsRoles".* from webadmins inner join "webadminsRoles" on webadmins."roleId" = "webadminsRoles".id where username = $1',
    },
    webadmins: {
      all: 'select * from webadmins',
      forAdminPanel:
        'select webadmins.*, "webadminsRoles".name as "roleName" from webadmins inner join "webadminsRoles" on webadmins."roleId" = "webadminsRoles".id',
      byUsername: 'select * from webadmins where username = $1',
    },
    registrationCodes: {
      all: 'select * from "registrationCodes"',
      byCode: 'select * from "registrationCodes" where "code" = $1',
    },
    additionalPayments: {
      forTableByEmployee:
        'select "additionalPayments".* from "additionalPayments" inner join employees on "additionalPayments"."employeeId" = employees.id where "chatId" = $1 and year = $2 and month = $3',
      byMonth: 'select * from "additionalPayments" where year = $1 and month = $2',
    },
    employees: {
      all: 'select * from employees',
      forAdminPanel:
        'select employees.id, employees."fullName", employees."birthDate", employees."phoneNumber", employees."identificationCode", employees."isFired", positions.name as "positionName", positions.price, "positionCategories".name as "positionCategoryName", "clothingSizes".name as "clothingSizeName", "photoName", organisations.name as "organisationName" from employees inner join positions on employees."positionId" = positions.id inner join "positionCategories" on positions."positionCategoryId" = "positionCategories".id inner join "clothingSizes" on employees."clothingSizeId" = "clothingSizes".id left join organisations on employees."organisationId" = organisations.id',
      byChatId: 'select * from employees where "chatId" = $1',
      byBirthday:
        'select * from employees where extract(day from "birthDate") = $1 and extract(month from "birthDate") = $2',
      clothing:
        'select employees.*, "clothingSizes".name as "clothingSize" from employees inner join "clothingSizes" on employees."clothingSizeId" = "clothingSizes".id where "isFired" = false order by "fullName"',
    },
    positionCategories: {
      all: 'select * from "positionCategories"',
    },
    positions: {
      forAdminPanel:
        'select positions.id, positions.name, positions.price, "positionCategories".name as "positionCategoryName" from positions inner join "positionCategories" on positions."positionCategoryId" = "positionCategories".id',
      byId: 'select * from positions where "id" = $1',
      byCategoryId: 'select * from positions where "positionCategoryId" = $1',
    },
    locationChecks: {
      all: 'select * from "locationChecks"',
      byId: 'select * from "locationChecks" where id = $1',
      active: 'select * from "locationChecks" where status in ($1, $2)',
    },
    locationCheckResults: {
      byEmpIdLocCheckId: 'select * from "locationCheckResults" where "employeeId" = $1 and "locationCheckId" = $2',
      byLocationCheckId: 'select * from "locationCheckResults" where "locationCheckId" = $1',
      forTable:
        'select "locationCheckResults".location, "locationCheckResults".working, employees."fullName", employees."phoneNumber", employees."identificationCode", positions.name as "positionName" from "locationCheckResults" right join employees on "locationCheckResults"."employeeId" = employees.id inner join positions on employees."positionId" = positions.id where "locationCheckId" = $1',
    },
    geocodingRequests: {
      byEmpIdLocCheckId: 'select * from "geocodingRequests" where "employeeId" = $1 and "locationCheckId" = $2',
      byLocationCheckIdWithLimit: 'select * from "geocodingRequests" where "locationCheckId" = $1 limit $2',
    },
    clothingSizes: {
      all: 'select * from "clothingSizes"',
      byId: 'select * from "clothingSizes" where "id" = $1',
    },
    objects: {
      byId: 'select * from objects where id = $1',
      forAdminPanel:
        'select objects.id, objects.city, objects.address, objects."isActive", objects."isDriveCompensated", objects."distanceInKM", regions.name as "regionName", regions.id as "regionId", contractors.id as "contractorId", contractors."fullName" as "contractorName" from objects inner join regions on objects."regionId" = regions.id left join contractors on objects."contractorId" = contractors.id',
      uniqueCities: 'select distinct city from objects order by city',
      byCity: 'select * from objects where city = $1',
      byRegionId: 'select * from objects where "regionId" = $1',
      activeByRegionId: 'select * from objects where "regionId" = $1 and "isActive" = true',
    },
    cars: {
      activeById: 'select * from cars where id = $1 and "isActive" = true',
      active: 'select * from cars where "isActive" = true',
      activeByFuelType: 'select * from cars where cars."fuelType" = $1 AND "isActive" = true order by cars."name"',
      forAdminPanel:
        'select * from cars order by "createdAt" desc',
      fuelTypes: 'select distinct cars."fuelType" from cars where "isActive" = true order by cars."fuelType"'
    },
    carRecords: {
      forTableByDays: `
        select "carRecords".id as "carRecordId",
              "carId",
              "objectId",
              "employeeId",
              "fuelPrice",
              "suspensionPrice",
              "carRecords"."fuelConsumption",
              distance,
              "travelDate",
              c.name          as "carName",
              c."fuelType"    as "carFuelType",
              "isCompanyProperty",
              "isActive"
        from "carRecords"
                left join cars c on c.id = "carRecords"."carId"
        where extract(year from "travelDate") = $1
          and extract(month from "travelDate") = $2
        order by "travelDate", "objectId"
      `
    },
    appeals: {
      all: 'select appeals.id, appeals.message, appeals."createdAt", employees."fullName", employees."phoneNumber" from appeals inner join employees on appeals."employeeId" = employees.id order by appeals."createdAt" desc',
      byMonth:
        'select appeals.id, appeals.message, appeals."createdAt", employees."fullName", employees."phoneNumber" from appeals inner join employees on appeals."employeeId" = employees.id where extract(year from "createdAt") = $1 and extract(month from "createdAt") = $2 order by appeals."createdAt" desc',
    },
    workShiftsActions: {
      byChatId:
        'select * from "workShiftsActions" inner join employees on "workShiftsActions"."employeeId" = employees.id where "chatId" = $1 order by "createdAt" desc, "typeId" desc',
      lastByEmployeeId:
        'select * from "workShiftsActions" where "employeeId" = $1 order by "createdAt" desc, "typeId" desc limit 1',
      byDateAndEmployeeId:
        'select * from "workShiftsActions" where "employeeId" = $1 and extract(year from "createdAt") = $2 and extract(month from "createdAt") = $3 and extract(day from "createdAt") = $4 order by "createdAt", "typeId"',
      byDateAndEmployeeIdAndObjectId:
        'select * from "workShiftsActions" where "employeeId" = $1 and "objectId" = $2 and extract(year from "createdAt") = $3 and extract(month from "createdAt") = $4 and extract(day from "createdAt") = $5 order by "createdAt", "typeId"',
      forTable:`
      select "workShiftsActions".id,
            "typeId",
            "employeeId",
            "workShiftsActions"."createdAt" as "createdAt",
            "workShiftsActions".location,
            "carFee",
            cv.name                       as "carName",
            "businessTrip",
            "workShiftsTypes".name          as "workShiftTypeName",
            employees."fullName",
            employees."phoneNumber",
            employees."identificationCode",
            positions.name                  as "positionName",
            positions.price                 as "positionPrice",
            regions.price                   as "regionPrice",
            organisations.name              as "organisationName",
            contractors.id                  as "contractorId",
            contractors."fullName"          as "contractorName",
            objects.city                    as "objectCity",
            objects.address                 as "objectAddress"
      from "workShiftsActions"
              inner join "workShiftsTypes" on "workShiftsActions"."typeId" = "workShiftsTypes".id
              inner join employees on "workShiftsActions"."employeeId" = employees.id
              inner join positions on employees."positionId" = "positions".id
              left join organisations on employees."organisationId" = organisations.id
              inner join objects on "workShiftsActions"."objectId" = objects.id
              left join contractors on objects."contractorId" = contractors.id
              inner join regions on objects."regionId" = regions.id
              left join (select id, name from cars) as cv on "workShiftsActions"."carId" = cv.id
      where extract(year from "createdAt") = $1
        and extract(month from "createdAt") = $2
      order by "createdAt" desc, "typeId" desc
      `,
      forTableByDays: `
        select "workShiftsActions".id,
            "typeId",
            "employeeId",
            "createdAt",
            "carFee",
            "businessTrip",
            employees."fullName",
            employees."phoneNumber",
            employees."identificationCode",
            positions.name         as "positionName",
            positions.price        as "positionPrice",
            regions.price          as "regionPrice",
            organisations.name     as "organisationName",
            contractors.id         as "contractorId",
            contractors."fullName" as "contractorName",
            objects.id             as "objectId",
            objects.city           as "objectCity",
            objects.address        as "objectAddress"
      from "workShiftsActions"
              inner join employees on "workShiftsActions"."employeeId" = employees.id
              inner join positions on employees."positionId" = "positions".id
              left join organisations on employees."organisationId" = organisations.id
              inner join objects on "workShiftsActions"."objectId" = objects.id
              left join contractors on objects."contractorId" = contractors.id
              inner join regions on objects."regionId" = regions.id
      where extract(year from "createdAt") = $1
        and extract(month from "createdAt") = $2
      order by "createdAt", "typeId"
        `,
      forTableByEmployee:
        'select "workShiftsActions".id, "typeId", "employeeId", "createdAt", "carFee", "businessTrip", employees."fullName", employees."phoneNumber", employees."identificationCode", positions.name as "positionName", positions.price as "positionPrice", regions.price as "regionPrice", organisations.name as "organisationName", contractors.id as "contractorId", contractors."fullName" as "contractorName", objects.id as "objectId", objects.city as "objectCity", objects.address as "objectAddress" from "workShiftsActions" inner join employees on "workShiftsActions"."employeeId" = employees.id inner join positions on employees."positionId" = "positions".id left join organisations on employees."organisationId" = organisations.id inner join objects on "workShiftsActions"."objectId" = objects.id left join contractors on objects."contractorId" = contractors.id inner join regions on objects."regionId" = regions.id where "chatId" = $1 and extract(year from "createdAt") = $2 and extract(month from "createdAt") = $3 order by "createdAt", "typeId"',
      lastOpened:
        'select "workShiftsActions".*, employees."chatId" from "workShiftsActions" inner join (select distinct first_value("workShiftsActions".id) over (partition by "employeeId" order by "createdAt" desc, "typeId" desc) as id from "workShiftsActions") "workShiftsActionsLast" on "workShiftsActions".id = "workShiftsActionsLast".id inner join employees on "employeeId" = employees.id where "typeId" = 1',
    },
    regions: {
      all: 'select * from regions',
      byActive: 'select * from regions where "isActive" = true',
    },
    contractors: {
      all: 'select * from contractors',
      byId: 'select * from contractors where id = $1',
    },
    vars: {
      all: 'select * from vars',
      byName: 'select * from vars where name = $1',
    },
    workingHoursChanges: {
      forAdminPanel:
        'select "workingHoursChanges".*, employees."fullName" as "fullName", objects.city || (case when length(objects.address) = 0 then \'\' else \' \' || objects.address end) as "objectName" from "workingHoursChanges" inner join employees on "workingHoursChanges"."employeeId" = employees.id inner join objects on "workingHoursChanges"."objectId" = objects.id order by "createdAt"',
      byMonth:
        'select * from "workingHoursChanges" where extract(year from date) = $1 and extract(month from date) = $2 order by "createdAt" desc',
      byChatIdAndMonth:
        'select "workingHoursChanges".* from "workingHoursChanges" inner join employees on "workingHoursChanges"."employeeId" = employees.id where employees."chatId" = $1 and extract(year from date) = $2 and extract(month from date) = $3 order by "workingHoursChanges"."createdAt" desc',
      byDateAndEmployeeId:
        'select * from "workingHoursChanges" where "employeeId" = $1 and extract(year from "date") = $2 and extract(month from "date") = $3 and extract(day from "date") = $4 order by "createdAt" desc',
    },
  },
  insert: {
    webadmin: 'insert into webadmins (username, password, "roleId") values ($1, $2, $3)',
    region: 'insert into regions (name, price) values ($1, $2)',
    object: 'insert into objects ("regionId", city, address, "contractorId", "isDriveCompensated", "distanceInKM") values ($1, $2, $3, $4, $5, $6)',
    appeal: 'insert into appeals (message, "employeeId") values ($1, $2)',
    positionCategory: 'insert into "positionCategories" (name) values ($1)',
    position: 'insert into positions ("positionCategoryId", name, price) values ($1, $2, $3)',
    locationCheck: 'insert into "locationChecks" (status) values ($1) returning *',
    registrationCode: 'insert into "registrationCodes" (code) values ($1) returning *',
    contractor: 'insert into contractors ("fullName") values ($1)',
    var: 'insert into vars (name, value) values ($1, $2)',
  },
  update: {
    admins: {
      addByChatId: 'update "telegramUsers" set "isAdmin" = true where "chatId" = $1',
      deleteByChatId: 'update "telegramUsers" set "isAdmin" = false where "chatId" = $1',
    },
    employees: {
      fireByIds: 'update employees set "isFired" = true where id = any($1::int[])',
    },
    locationChecks: {
      status: 'update "locationChecks" set status = $1 where id = $2',
    },
  },
  delete: {
    users: {
      byChatIds: 'delete from "telegramUsers" where "chatId" = any($1::varchar[])',
    },
    webadmins: {
      byIds: 'delete from webadmins where id = any($1::int[])',
    },
    workShiftsActions: {
      byIds: 'delete from "workShiftsActions" where id = any($1::int[])',
    },
    registrationCodes: {
      byCode: 'delete from "registrationCodes" where "code" = $1',
      byCodes: 'delete from "registrationCodes" where "code" = any($1::varchar[])',
    },
    regions: {
      byIds: 'delete from regions where id = any($1::int[])',
    },
    objects: {
      byIds: 'delete from objects where id = any($1::int[])',
    },
    appeals: {
      byIds: 'delete from appeals where id = any($1::int[])',
    },
    locationChecks: {
      active: 'delete from "locationChecks" where status in ($1, $2)',
    },
    geocodingRequests: {
      byIds: 'delete from "geocodingRequests" where id = any($1::int[])',
    },
    contractors: {
      byIds: 'delete from contractors where id = any($1::int[])',
    },
  },
  upsert: {
    additionalPayments: `
      insert into "additionalPayments" ("employeeId", type, year, month, sum)
      values ($1, $2, $3, $4, $5)
      on conflict ("employeeId", type, year, month) do update
      set sum = $5
    `,
  },
  build: {
    insert: (params: { tableName: string; columns: string[] }) => {
      const { tableName, columns } = params;

      const paramsString = Queries.getParamsString(columns.length);
      const query = `insert into "${tableName}" (${columns.join(',')}) values (${paramsString}) returning *`;
      return query;
    },
    update: (params: { tableName: string; columns: string[]; where?: string }) => {
      const { tableName, columns, where } = params;

      const columnsSet = columns.map((column, index) => {
        return `${column} = \$${index + 1}`;
      });
      let query = `update "${tableName}" set ${columnsSet.join(',')}`;
      query += where ? ` where ${where}` : '';
      return query;
    },
    delete: {
      responses: {
        bySearchIds: (searchIds: number[], userIds: number[]) => {
          const query =
            'delete from "responsesWaitingForSending"' +
            `where "searchId" in (${searchIds.join(',')}) and "userId" in (${userIds.join(',')})`;
          return query;
        },
      },
    },
    insertWithMultipleValues: (params: { tableName: string; columns: string[]; valuesAmount: number }) => {
      const { tableName, columns, valuesAmount } = params;

      const multipleValuesParamsString = Queries.getMultipleValuesParamsString({
        length: valuesAmount * columns.length,
        columnsAmount: columns.length,
      });
      const query = `insert into "${tableName}" (${columns
        .map(column => '"' + column + '"')
        .join(',')}) values ${multipleValuesParamsString} returning *`;
      return query;
    },
  },
  convertObjectToColumnsAndValues: data => {
    const keys = Object.keys(data);
    const values = keys.map(key => data[key]);
    const columns = keys.map(key => `"${key}"`);
    return { columns, values };
  },
  getParamsString: (length: number) => {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push('$' + (i + 1));
    }
    return arr.join(',');
  },
  getMultipleValuesParamsString: (params: { length: number; columnsAmount: number }) => {
    const { length, columnsAmount } = params;

    const arr = [];
    let values = [];
    for (let i = 0; i < length; i++) {
      values.push('$' + (i + 1));
      if (values.length === columnsAmount || i === length - 1) {
        arr.push('(' + values.join(',') + ')');
        values = [];
      }
    }
    return arr.join(',');
  },
};

export default Queries;
