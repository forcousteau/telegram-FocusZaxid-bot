import regionsHandlers from '../handlers/regions';
import objectsHandlers from '../handlers/objects';
import positionCategoriesHandlers from '../handlers/positionCategories';
import positionsHandlers from '../handlers/positions';
import employeesHandlers from '../handlers/employees';
import birthdaysHandlers from '../handlers/birthdays';
import reportsHandlers from '../handlers/reports';
import locationChecksHandlers from '../handlers/locationChecks';
import locationCheckResultsHandlers from '../handlers/locationCheckResults';
import registrationCodesHandlers from '../handlers/registrationCodes';
import adminPanelHandlers from '../handlers/adminPanel';
import contractorsHandlers from '../handlers/contractors';
import webadminsHandlers from '../handlers/webadmins';
import webadminsRolesHandlers from '../handlers/webadminsRoles';
import imagesHandlers from '../handlers/images';
import varsHandlers from '../handlers/vars';
import workingHoursChangesHandlers from '../handlers/workingHoursChanges';
import appealsHandlers from '../handlers/appeals';
import interactiveTableHandlers from '../handlers/interactiveTable';

const Routes = {
  isInit: false,
  getAuthCheckedHandler: function (handler) {
    return async function (ctx) {
      if (!ctx.session.isAuth) {
        return (ctx.status = 401);
      }
      await handler(ctx);
    };
  },
  init: function (router) {
    if (this.isInit) {
      return;
    }

    this.isInit = true;

    /*** Webadmins roles ***/
    router.get('/api/webadminsRoles', this.getAuthCheckedHandler(webadminsRolesHandlers.read));

    /*** Webadmins ***/
    router.post('/api/webadmins', this.getAuthCheckedHandler(webadminsHandlers.create));
    router.get('/api/webadmins', this.getAuthCheckedHandler(webadminsHandlers.read));
    router.put('/api/webadmins', this.getAuthCheckedHandler(webadminsHandlers.update));
    router.delete('/api/webadmins', this.getAuthCheckedHandler(webadminsHandlers.delete));

    /*** Regions ***/
    router.post('/api/regions', this.getAuthCheckedHandler(regionsHandlers.create));
    router.get('/api/regions', this.getAuthCheckedHandler(regionsHandlers.read));
    router.put('/api/regions', this.getAuthCheckedHandler(regionsHandlers.update));

    /*** Objects ***/
    router.post('/api/objects', this.getAuthCheckedHandler(objectsHandlers.create));
    router.get('/api/objects', this.getAuthCheckedHandler(objectsHandlers.read));
    router.put('/api/objects', this.getAuthCheckedHandler(objectsHandlers.update));

    /*** Contractors ***/
    router.post('/api/contractors', this.getAuthCheckedHandler(contractorsHandlers.create));
    router.get('/api/contractors', this.getAuthCheckedHandler(contractorsHandlers.read));
    router.put('/api/contractors', this.getAuthCheckedHandler(contractorsHandlers.update));
    router.delete('/api/contractors', this.getAuthCheckedHandler(contractorsHandlers.delete));

    /*** Positions categories ***/
    router.post('/api/positionCategories', this.getAuthCheckedHandler(positionCategoriesHandlers.create));
    router.get('/api/positionCategories', this.getAuthCheckedHandler(positionCategoriesHandlers.read));
    router.put('/api/positionCategories', this.getAuthCheckedHandler(positionCategoriesHandlers.update));

    /*** Positions ***/
    router.post('/api/positions', this.getAuthCheckedHandler(positionsHandlers.create));
    router.get('/api/positions', this.getAuthCheckedHandler(positionsHandlers.read));
    router.put('/api/positions', this.getAuthCheckedHandler(positionsHandlers.update));

    /*** Employees ***/
    router.get('/api/employees', this.getAuthCheckedHandler(employeesHandlers.read));
    router.put('/api/employees', this.getAuthCheckedHandler(employeesHandlers.update));
    router.delete('/api/employees', this.getAuthCheckedHandler(employeesHandlers.delete));

    /*** Birthdays ***/
    router.get('/api/birthdays', this.getAuthCheckedHandler(birthdaysHandlers.read));

    /*** Reports ***/
    router.get('/api/reports/byDays', this.getAuthCheckedHandler(reportsHandlers.byDays.read));
    router.get('/api/reports/appeals', this.getAuthCheckedHandler(reportsHandlers.appeals.read));
    router.get('/api/reports/clothing', this.getAuthCheckedHandler(reportsHandlers.clothing.read));
    router.get('/api/reports/workShiftsActions', this.getAuthCheckedHandler(reportsHandlers.workShiftsActions.read));
    router.get('/api/reports/byEmployees', this.getAuthCheckedHandler(reportsHandlers.byEmployees.read));
    router.get('/api/reports/byContractors', this.getAuthCheckedHandler(reportsHandlers.byContractors.read));
    router.get('/api/reports/byObjects', this.getAuthCheckedHandler(reportsHandlers.byObjects.read));

    /*** Location checks ***/
    router.post('/api/locationChecks', this.getAuthCheckedHandler(locationChecksHandlers.create));
    router.get('/api/locationChecks', this.getAuthCheckedHandler(locationChecksHandlers.read));

    /*** Location check results ***/
    router.get('/api/locationCheckResults/table', this.getAuthCheckedHandler(locationCheckResultsHandlers.table.read));

    /*** Registration codes ***/
    router.post('/api/registrationCodes', this.getAuthCheckedHandler(registrationCodesHandlers.create));
    router.get('/api/registrationCodes', this.getAuthCheckedHandler(registrationCodesHandlers.read));
    router.delete('/api/registrationCodes', this.getAuthCheckedHandler(registrationCodesHandlers.delete));

    /*** Images ***/
    router.post('/api/images', this.getAuthCheckedHandler(imagesHandlers.create));

    /*** Vars ***/
    router.get('/api/vars', this.getAuthCheckedHandler(varsHandlers.read));
    router.put('/api/vars', this.getAuthCheckedHandler(varsHandlers.update));

    /*** Working hours changes ***/
    router.get('/api/workingHoursChanges', this.getAuthCheckedHandler(workingHoursChangesHandlers.read));

    /*** Appeals ***/
    router.get('/api/appeals', this.getAuthCheckedHandler(appealsHandlers.read));
    router.delete('/api/appeals', this.getAuthCheckedHandler(appealsHandlers.delete));

    /*** Interactive table ***/
    router.get('/api/interactiveTable', this.getAuthCheckedHandler(interactiveTableHandlers.read));
    router.put(
      '/api/interactiveTable/workingHours',
      this.getAuthCheckedHandler(interactiveTableHandlers.updateWorkingHours)
    );
    router.put(
      '/api/interactiveTable/additionalPayment',
      this.getAuthCheckedHandler(interactiveTableHandlers.updateAdditionalPayment)
    );

    /*** Admin panel ***/
    router.get('/api/auth/check', adminPanelHandlers.auth.check);
    router.post('/api/auth/login', adminPanelHandlers.auth.login);
    router.get('/api/auth/logout', adminPanelHandlers.auth.logout);
    router.get('/(.*)', adminPanelHandlers.panel.main);
  },
};

export default Routes;
