import { ONE_HOUR } from '../../constants';
import { updateVarByName } from '../../services/vars';
import axios from 'axios';
import _ from 'lodash';

export const interval = ONE_HOUR * 2; // 2 hours

export async function daemon() {
    const currentDate = new Date();
    if (currentDate.getHours() <= 4) {
        try {
            const url = 'https://auto.ria.com/content/news/templetify/fuel_price_page/?morePagination=.moreNews&sizeNews=0&elementsContentItem=.js-news-wrap+.news-item&SearchNews=%23SearchNews&newsContentChange=%23newsContentChange&dataElements=.time-add&subscriber=%23subscriber&currentDevice=desktop&langId=4&city=0&refuel=1&fuel=&size=7&exchangeRates%5B0%5D%5Bname%5D=USD&exchangeRates%5B0%5D%5Bbid%5D=37.12&exchangeRates%5B0%5D%5Bask%5D=37.21&exchangeRates%5B0%5D%5BchangeBid%5D=-0.0088&exchangeRates%5B0%5D%5BchangeAsk%5D=-0.0174&exchangeRates%5B0%5D%5Bdate%5D=2023-07-09T17%3A30%3A00.000Z&exchangeRates%5B0%5D%5Bunix_time%5D=1688923800&exchangeRates%5B1%5D%5Bname%5D=EUR&exchangeRates%5B1%5D%5Bbid%5D=40.74&exchangeRates%5B1%5D%5Bask%5D=40.90&exchangeRates%5B1%5D%5BchangeBid%5D=0.0059&exchangeRates%5B1%5D%5BchangeAsk%5D=0&exchangeRates%5B1%5D%5Bdate%5D=2023-07-09T17%3A30%3A00.000Z&exchangeRates%5B1%5D%5Bunix_time%5D=1688923800&main=https%3A%2F%2Fimg7.auto.ria.com%2Fjs%2Fbuilds%2Findex.js%3Fv%3D8.3.938679&version=8.3.938679&geoIpLocation=5_5&url=%2Ftoplivo%2Fokko%2F&tagId=69&langPrefix=%2Fuk'
            const response = await axios({
                url,
                method: 'GET',
            });
            if (response.status == 200) {
                const petrolPrice = _.get(response, 'data.buckets[0].a95f.avg');
                const dieselPrice = _.get(response, 'data.buckets[0].dtf.avg');
                const gasPrice = _.get(response, 'data.buckets[0].gazf.avg');

                if (petrolPrice) await updateVarByName({ name: 'petrolPrice', value: petrolPrice });
                if (dieselPrice) await updateVarByName({ name: 'dieselPrice', value: dieselPrice });
                if (gasPrice) await updateVarByName({ name: 'gasPrice', value: gasPrice });

                await updateVarByName({ name: "lastFuelUpdate", value: currentDate.toLocaleString('ua-Uk', { timeZone: 'Europe/Kyiv' }) });
            }

        }
        catch (err) {
            console.log(err)
        }


    }
}

export default {
    interval,
    daemon,
};
