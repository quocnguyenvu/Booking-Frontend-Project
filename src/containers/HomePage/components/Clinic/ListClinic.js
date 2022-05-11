import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import HomeHeader from '../../../../components/Header/HomeHeader';
import * as actions from '../../../../store/actions';
import CopyRight from '../Section/CoppyRight';
import './ListClinic.scss';

class ListClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listClinic: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllClinic();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        listClinic: this.props.data,
      });
    }
  }

  handleViewDetailClinic = (clinicId) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinicId.id}`);
    }
  };

  render() {
    let { language } = this.props;
    console.log(language);
    let { listClinic } = this.state;
    console.log('listClinic:', listClinic);
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <section className='clinic'>
          <h2 className='title'>Danh sách các cơ sở y tế</h2>
          <div className='list-doctor'>
            {listClinic &&
              listClinic.length > 0 &&
              listClinic.map((item, index) => {
                return (
                  <div className='clinic-item' key={index}>
                    <div className='name-clinic'>{item.name}</div>
                    <div className='address-clinic'>{item.address}</div>
                    <div className='image-clinic'>
                      <img src={item.image} alt='' />
                    </div>
                    <div onClick={() => this.handleViewDetailClinic(item)}>
                      Xem thêm
                    </div>
                  </div>
                );
              })}
            {listClinic.length <= 0 ? 'Không tìm thấy các cơ sở y tế...' : ''}
          </div>
        </section>
        <CopyRight />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    data: state.admin.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllClinic: () => dispatch(actions.fetchAllClinicStart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListClinic)
);