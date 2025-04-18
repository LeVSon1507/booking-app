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
import FilterSearch from './Room/FilterSearch';
import FilterType from './Room/FilterType';

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
        // window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, [filters]);

  // chọn ngày
  const filterByDate = (dates) => {
    if (!dates) return;
    console.log(moment(dates[0]).format('DD-MM-YYYY'));
    console.log(moment(dates[1]).format('DD-MM-YYYY'));
    setStartDate(dates[0].format('DD-MM-YYYY'));
    setEndDate(dates[1].format('DD-MM-YYYY'));

    let tempRooms = [];
    let availability = false;

    // duyệt qua tất cả rooms
    for (const room of duplicateRoom) {
      // nếu currentBookings > 0 -> loại bỏ ko cho room
      if (room.currentBookings.length > 0) {
        // duyệt qua tất cả  room.currentBooking -> check lịch
        for (const booking of room.currentBookings) {
          console.log(booking);
        }
      }
      // nếu currentBookings == 0 -> push(room)
      if (availability === true || room.currentBookings.length === 0) {
        tempRooms.push(room);
      }
      // setRooms(tempRooms);
    }
  };

  // chặn chọn ngày trước đó
  function disabledDate(current) {
    return current && current.valueOf() < moment().endOf('day');
  }

  const handleSearchForm = (newFilter) => {
    // set filter kéo theo giưa search và type
    setFilters({
      ...filters,
      search: newFilter.searchRoom,
    });
    console.log(filters);
  };

  const handleOnChangeType = (newFilter) => {
    // set filter kéo theo giưa search và type
    setFilters({
      ...filters,
      type: newFilter.filterRoom,
    });
  };

  return (
    <Fragment>
      <MetaData title="Trang chủ" />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Banner />
          <div className="container" id="home">
            <h1 className="text-center mt-5 title">ĐẶT PHÒNG NGAY</h1>
            <div className="row bs" id="booking-fixed">
              <div className="col-md-4" id="datepicker">
                <RangePicker
                  format="DD-MM-YYYY"
                  disabledDate={disabledDate}
                  onChange={filterByDate}
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
                  <h2 className="mt-5">Không tìm thấy kết quả</h2>
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
