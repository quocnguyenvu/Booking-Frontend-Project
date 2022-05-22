import { Pagination } from 'antd';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

import './TableManageClinic.scss';

const pageSize = 10;
class TableManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicArray: [],
      current: 1,
    };
  }

  componentDidMount() {
    this.props.fetchAllClinic();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.allClinics !== this.props.allClinics) {
      this.setState({
        clinicArray: this.props.allClinics,
        minIndex: 0,
        maxIndex: pageSize,
      });
    }
  }

  handleDeleteClinic = (clinic) => {
    this.props.deleteClinic(clinic.id);
  };

  handleEditClinic = (clinic) => {
    this.props.handleEditClinic(clinic);
  };

  handleChangePageNumber = (page) => {
    console.log(page);
    this.setState({
      current: page,
      minIndex: (page - 1) * pageSize,
      maxIndex: page * pageSize,
    });
  };

  render() {
    let listClinic = this.state.clinicArray;

    return (
      <div className='user-container'>
        <h1 className='title-user'>
          <FormattedMessage id='admin.manage-clinic.table' />
        </h1>
        <div className='users-table'>
          <table id='customers'>
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Address</th>
                <th>Options</th>
              </tr>
            </thead>

            <tbody>
              {listClinic.map(
                (item, index) =>
                  index >= this.state.minIndex &&
                  index < this.state.maxIndex && (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.address}</td>
                      <td>
                        <button
                          className='btn-edit'
                          onClick={() => this.handleEditClinic(item)}
                        >
                          <i className='fas fa-pencil-alt'></i>
                        </button>
                        <button
                          className='btn-delete'
                          onClick={() => this.handleDeleteClinic(item)}
                        >
                          <i className='fas fa-trash-alt'></i>
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          current={this.state.current}
          onChange={this.handleChangePageNumber}
          pageSize={pageSize}
          total={listClinic.length}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allClinics: state.admin.allClinics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllClinic: () => dispatch(actions.fetchAllClinic()),
    deleteClinic: (id) => dispatch(actions.deleteClinic(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageClinic);
