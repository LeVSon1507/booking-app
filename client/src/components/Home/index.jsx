import { DatePicker } from 'antd';
import { roomApi } from 'api/roomApi';
import Banner from 'components/Layout/Banner';
import Loader from 'components/utils/Loader';
import MetaData from 'components/utils/MetaData';
import moment from 'moment';
import queryString from 'query-string';
import React, { Fragment, useEffect, useState } from 'react';
import LazyLoad from 'react-lazyload';
import './Home.css';
import Room from './Room';
import FilterSearch from './Room/FilterSearch/FilterSearch';
import FilterType from './Room/FilterType/FilterType';
import { ReactComponent as DateIcon } from '../../images/undraw_schedule-meeting_aklb.svg';

const { RangePicker } = DatePicker;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [duplicateRoom, setDuplicateRoom] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const paramsString = '?' + queryString.stringify(filters);
        const response = await roomApi.getManyRooms(paramsString);
        setRooms(response.data);
        setDuplicateRoom(response.data);
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

    let tempRooms = [];
    let availability = false;

    for (const room of duplicateRoom) {
      if (room.currentBookings.length > 0) {
        for (const booking of room.currentBookings) {
          console.log(booking);
        }
      }
      if (availability === true || room.currentBookings.length === 0) {
        tempRooms.push(room);
      }
    }
  };

  function disabledDate(current) {
    return current && current.valueOf() < moment().endOf('day');
  }

  const handleSearchForm = (newFilter) => {
    setFilters({
      ...filters,
      search: newFilter.searchRoom,
    });
  };

  const handleOnChangeType = (newFilter) => {
    setFilters({
      ...filters,
      type: newFilter.filterRoom,
    });
  };

  return (
    <Fragment>
      <MetaData title="Home" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Banner />
          <div className="container" id="home">
            <div className="row justify-content-center">
              <h1 className="text-center mt-5 title">BOOK NOW</h1>
              <DateIcon width={100} height={100} />
            </div>
            <div className="row bs" id="booking-fixed">
              <div className="col-md-4" id="datepicker">
                <RangePicker
                  placeholder={['Start date', 'End date']}
                  format="DD-MM-YYYY"
                  disabledDate={disabledDate}
                  onChange={filterByDate}
                  nextIcon={<DateIcon width={100} height={100} />}
                />
              </div>
              <div className="col-md-4">
                <FilterSearch onSubmit={handleSearchForm} rooms={duplicateRoom} />
              </div>
              <div className="col-md-4">
                <FilterType onChange={handleOnChangeType} rooms={duplicateRoom} />
              </div>
            </div>

            <div className="row justify-content-center mt-2">
              {rooms.length === 0 ? (
                <div className="no-result bs mt-3">
                  <h2 className="mt-5">No results found</h2>
                </div>
              ) : (
                <Fragment>
                  {rooms?.map((room) => {
                    return (
                      <div key={room._id} className="col-md-9 mt-2">
                        <LazyLoad height={200} offset={100} debounce={300} once>
                          <Room room={room} startDate={startDate} endDate={endDate} />
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
