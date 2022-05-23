import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.initFacebookSDK();
  }

  async componentDidUpdate(prevProps, prevState) {
    let { language } = this.props;
    if (language !== prevProps.language) {
      this.initFacebookSDK();
    }
  }

  initFacebookSDK() {
    let { language } = this.props;

    if (window.FB) {
      window.FB.XFBML.parse();
    }

    let locale = language === LANGUAGES.VI ? 'vi_VN' : 'en_US';
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
<<<<<<< HEAD
        cookie: true,
        xfbml: true,
        version: 'v13.0'
=======
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v13.0',
>>>>>>> ab22cd6eaf98ea1a19828a6bbf6f80c8f074a48c
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  render() {
    let { width, dataHref, numPost } = this.props;
    console.log(process.env.REACT_APP_FACEBOOK_APP_ID);
    return (
      <>
        <div
          class='fb-comments'
          data-href={dataHref}
          data-width={width ? width : ''}
          data-numposts={numPost ? numPost : 5}
        ></div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
