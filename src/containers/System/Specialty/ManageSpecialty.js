import MarkdownIt from 'markdown-it';

import React, { Component } from 'react';

import Select from 'react-select';
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';

import { FormattedMessage } from 'react-intl';
import MdEditor from 'react-markdown-editor-lite';

import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

import TableManageSpecialty from './TableManageSpecialty'
import './ManageSpecialty.scss';



const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      imageBase64: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
      action: '',

      clinicId: '',
      listClinic: [],
    };
  }

  async componentDidMount() {
    // this.props.fetchAllClinic();
    this.props.getRequireDoctorInfor();
  }

  async componentDidUpdate(prevProps, prevState) {
    let { language } = this.props;
    if (language !== prevProps.language) {
    }

    if (prevProps.data !== this.props.data) {
      this.setState({
        name: '',
        imageBase64: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
        clinicId: '',
        listClinic: this.props.data,
        action: CRUD_ACTIONS.CREATE,
      });
    }

    if (prevProps.allRequireDoctorInfor !== this.props.allRequireDoctorInfor) {
      let { resClinic } = this.props.allRequireDoctorInfor;

      let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');

      this.setState({
        listClinic: dataSelectClinic,
      });
    }
  }

  buildDataInputSelect = (data, type) => {
    let result = [];
    if (data && data.length > 0) {
      if (type === 'CLINIC') {
        data.map((item) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        })
      }
    }
    return result;
  };

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionMarkdown: text,
      descriptionHTML: html,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveSpecialty = async () => {
    let { action } = this.state;

    if (action === CRUD_ACTIONS.CREATE) {
      let res = await this.props.createNewSpecialty(this.state);
      if (res && res.errCode === 0) {
        this.setState({
          name: '',
          imageBase64: '',
          descriptionHTML: '',
          descriptionMarkdown: '',
          clinicId: '',
        });
      }
    }

    if (action === CRUD_ACTIONS.EDIT) {
      let res = await this.props.editSpecialty({
        id: this.state.id,
        name: this.state.name,
        imageBase64: this.state.imageBase64,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
        clinicId: this.state.clinicId,
      });
      if (res && res.errCode === 0) {
        this.setState({
          id: '',
          name: '',
          imageBase64: '',
          descriptionHTML: '',
          descriptionMarkdown: '',
          clinicId: '',
        });
      }
    }
  };

  handleEditSpecialty = (specialty) => {
    let imageBase64 = '';
    if (specialty.image) {
      imageBase64 = Buffer.from(specialty.image, 'base64').toString('binary');
      console.log(imageBase64);
    }

    this.setState({
      id: specialty.id,
      name: specialty.name,
      image: specialty.imageBase64,
      descriptionHTML: specialty.descriptionHTML,
      descriptionMarkdown: specialty.descriptionMarkdown,
      clinicId: specialty.clinicId,
      action: CRUD_ACTIONS.EDIT,
    });
  };

  handleOnChangeSelect = async (selectedOption) => {
    let { listClinic } = this.state;

    if (listClinic && listClinic.length > 0) {
      this.setState({
        clinicId: selectedOption.value,
      });
    } else {
      this.setState({
        clinicId: '',
      });
    }
  };

  render() {
    let { name, descriptionMarkdown, listClinic } = this.state;
    console.log('list: ', listClinic);
    return (
      <div className='manage-specialty'>
        <h2 className='title'>
          <FormattedMessage id='admin.manage-specialty.specialty-title' />
        </h2>

        <div className='specialty-list row'>
          <div className='col-4 form-group'>
            <label>
              <FormattedMessage id='admin.manage-specialty.specialty-name' />
            </label>
            <input
              className='form-control'
              type='text'
              value={name}
              placeholder='Specialty Name...'
              onChange={(event) => this.handleOnChangeInput(event, 'name')}
            />
          </div>
          <div className='col-4 form-group'>
            <label>
              <FormattedMessage id='admin.manage-doctor.clinic' />
            </label>
            <Select
              className='choose-doctor-select'
              // value={this.state}
              onChange={this.handleOnChangeSelect}
              options={listClinic}
              placeholder={<FormattedMessage id='admin.manage-doctor.clinic' />}
              name='selectedClinic'
            />
          </div>
          <div className='col-4 form-group'>
            <label>
              <FormattedMessage id='admin.manage-specialty.specialty-image' />
            </label>
            <input
              className='form-control-file'
              type='file'
              onChange={(event) => this.handleOnChangeImage(event)}
            />
          </div>
          <div className='col-12'>
            <MdEditor
              style={{ height: '300px' }}
              onChange={(event) => this.handleEditorChange(event)}
              value={descriptionMarkdown}
              renderHTML={(text) => mdParser.render(text)}
            />
          </div>
          <div className='col-12'>
            <button
              className={
                this.state.action === CRUD_ACTIONS.EDIT
                  ? 'btn-edit-specialty'
                  : 'btn-add-specialty'
              }
              onClick={() => this.handleSaveSpecialty()}
            >
              {this.state.action === CRUD_ACTIONS.EDIT ? (
                <FormattedMessage id='admin.manage-specialty.edit' />
              ) : (
                <FormattedMessage id='admin.manage-specialty.save' />
              )}
            </button>
          </div>
        </div>

        <TableManageSpecialty
          handleEditSpecialty={this.handleEditSpecialty}
          action={this.state.action}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    data: state.admin.data,
    allRequireDoctorInfor: state.admin.allRequireDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createNewSpecialty: (data) =>
      dispatch(actions.fetchCreateNewSpecialty(data)),
    editSpecialty: (data) => dispatch(actions.editSpecialty(data)),
    getRequireDoctorInfor: () => dispatch(actions.getRequireDoctorInfor()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
