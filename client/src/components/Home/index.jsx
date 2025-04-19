import { DatePicker } from 'antd';
import { hotelApi } from 'api/hotelApi';
import Banner from 'components/Layout/Banner';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import moment from 'moment';
import queryString from 'query-string';
import React, { Fragment, useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import './Home.css';
import Hotel from './Hotel/Hotel';
import FilterSearch from './Room/FilterSearch/FilterSearch';
import { ReactComponent as DateIcon } from '../../images/undraw_schedule-meeting_aklb.svg';

const { RangePicker } = DatePicker;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [duplicateHotels, setDuplicateHotels] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const paramsString = '?' + queryString.stringify(filters);
        const response = await hotelApi.getAllHotels(paramsString);
        setHotels(response.data);
        setDuplicateHotels(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [filters]);

  const filterByDate = (dates) => {
    if (!dates) return;
    setStartDate(dates[0].format('DD-MM-YYYY'));
    setEndDate(dates[1].format('DD-MM-YYYY'));
  };

  function disabledDate(current) {
    return current && current.valueOf() < moment().endOf('day');
  }

  const handleSearchForm = (newFilter) => {
    setFilters({
      ...filters,
      search: newFilter.searchHotel,
    });
  };

  const handleCityChange = (newFilter) => {
    setFilters({
      ...filters,
      city: newFilter.city,
    });
  };

  return (
    <Fragment>
      <MetaData title="Home - Find Hotels" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Banner />
          <div className="container" id="home">
            <div className="row justify-content-center">
              <h1 className="text-center mt-5 title">FIND YOUR PERFECT STAY</h1>
              <DateIcon width={100} height={100} />
            </div>
            <div className="row bs" id="booking-fixed">
              <div className="col-md-4" id="datepicker">
                <RangePicker
                  placeholder={['Check-in', 'Check-out']}
                  format="DD-MM-YYYY"
                  disabledDate={disabledDate}
                  onChange={filterByDate}
                />
              </div>
              <div className="col-md-4">
                <FilterSearch
                  onSubmit={handleSearchForm}
                  placeholder="Search hotels..."
                  searchKey="searchHotel"
                />
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    className="form-control"
                    onChange={(e) => handleCityChange({ city: e.target.value })}
                  >
                    <option value="">All Cities</option>
                    {[...new Set(duplicateHotels.map((hotel) => hotel.city))].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row justify-content-center mt-2">
              {hotels.length === 0 ? (
                <div className="no-result bs mt-3">
                  <h2 className="mt-5">No hotels found</h2>
                </div>
              ) : (
                <Fragment>
                  {hotels?.map((hotel) => {
                    return (
                      <div key={hotel._id} className="col-md-9 mt-2">
                        <LazyLoad height={200} offset={100} debounce={300} once>
                          <Hotel hotel={hotel} />
                        </LazyLoad>
                      </div>
                    );
                  })}
                </Fragment>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
