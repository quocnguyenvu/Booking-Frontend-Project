import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../../components/Header/HomeHeader';
import { getAllDetailClinicById } from '../../../services/userService';
import { withRouter } from 'react-router';

import _ from 'lodash';
import './DetailClinic.scss';
import Footer from '../../HomePage/components/Section/Footer';

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDetailClinic: {},
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;

      let res = await getAllDetailClinicById({
        id: id,
      });

      if (res && res.errCode === 0) {
        this.setState({
          dataDetailClinic: res.data,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    let { language } = this.props;
    if (language !== prevProps.language) {
    }
  }

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  render() {
    let { dataDetailClinic } = this.state;
    // let { language } = this.props;
    let listSpecialty = dataDetailClinic.specialtyClinic;

    return (
      <div className='detail-clinic'>
        <HomeHeader />
        <section className='banner'>
          {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
            <>
              <div className='name-clinic'>{dataDetailClinic.name}</div>
              <div className='address-clinic'>{dataDetailClinic.address}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailClinic.descriptionHTML,
                }}
              ></div>
            </>
          )}
        </section>
        <section className='specialty-list'>
          {listSpecialty &&
            listSpecialty.length > 0 &&
            listSpecialty.map((item, index) => {
              return (
                <div className='specialty-item' key={index}>
                  <div className='infor-specialty'>
                    <div className='specialty-name'>{item.name}</div>
                    <img className='specialty-image' src={item.image} alt='' />
                    <span onClick={() => this.handleViewDetailSpecialty(item)}>
                      Xem thêm
                    </span>
                  </div>
                </div>
              );
            })}
        </section>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailClinic)
);
