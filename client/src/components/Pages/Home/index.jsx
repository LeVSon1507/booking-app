import { hotelApi } from 'api/hotelApi';
import { DatePicker } from 'antd';
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
import { ReactComponent as DateIcon } from '@images/undraw_schedule-meeting_aklb.svg';

const { RangePicker } = DatePicker;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    startDate: '',
    endDate: '',
  });
  const [cities, setCities] = useState([]);
  const [dateSelected, setDateSelected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await hotelApi.getAllHotels('');
        const uniqueCities = [...new Set((response?.data || []).map((hotel) => hotel.city))];
        setCities(uniqueCities);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log('Fetching with params:', filters);

        const params = {
          search: filters.search,
          city: filters.city,
        };

        if (filters.startDate && filters.endDate) {
          params.startDate = filters.startDate;
          params.endDate = filters.endDate;
        }

        const paramsString = '?' + queryString.stringify(params);
        console.log('API call:', paramsString);

        const response = await hotelApi.getAllHotels(paramsString);
        console.log('API response:', response);

        setHotels(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
        setLoading(false);
      }
    })();
  }, [filters]);

  const filterByDate = (dates) => {
    if (!dates) {
      setFilters({
        ...filters,
        startDate: '',
        endDate: '',
      });
      setDateSelected(false);
      return;
    }

    setFilters({
      ...filters,
      startDate: dates[0].format('DD-MM-YYYY'),
      endDate: dates[1].format('DD-MM-YYYY'),
    });
    setDateSelected(true);
  };

  function disabledDate(current) {
    return current && current.valueOf() < moment().endOf('day');
  }

  const handleSearchForm = (newFilter) => {
    setFilters({
      ...filters,
      search: newFilter.searchTerm,
    });
  };

  const handleCityChange = (newFilter) => {
    setFilters({
      ...filters,
      city: newFilter.city,
    });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    return dateString;
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
                  allowClear={true}
                  nextIcon={<DateIcon width={100} height={100} />}
                />
              </div>
              <div className="col-md-4">
                <FilterSearch
                  onSubmit={handleSearchForm}
                  placeholder="Search by hotel name..."
                  searchKey="searchHotel"
                />
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    id="citySelect"
                    className="form-control"
                    onChange={(e) => handleCityChange({ city: e.target.value })}
                    value={filters.city}
                  >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {dateSelected && filters.startDate && filters.endDate && (
              <div className="row justify-content-center mt-3">
                <div className="col-md-9">
                  <div className="alert alert-info">
                    Showing hotels with available rooms from {formatDisplayDate(filters.startDate)}{' '}
                    to {formatDisplayDate(filters.endDate)}
                  </div>
                </div>
              </div>
            )}

            <div className="row justify-content-center mt-2">
              {Array.isArray(hotels) && hotels.length > 0 ? (
                hotels.map((hotel) => (
                  <div key={hotel._id} className="col-md-9 mt-2">
                    <LazyLoad height={200} offset={100} debounce={300} once>
                      <Hotel
                        hotel={hotel}
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                      />
                    </LazyLoad>
                  </div>
                ))
              ) : (
                <div className="no-result bs mt-3">
                  <h2 className="mt-5">
                    {dateSelected
                      ? `No hotels available from ${formatDisplayDate(
                          filters.startDate
                        )} to ${formatDisplayDate(filters.endDate)}`
                      : 'No hotels found'}
                  </h2>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
