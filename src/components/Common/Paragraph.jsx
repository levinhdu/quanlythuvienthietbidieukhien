import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helpers from 'src/helpers';

export default class paragraph extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      readMore: {
        noiDung: false
      },
      rows: this.props.rows || 3,
      lineHeight: this.props.lineHeight || 18
    };
  }

  componentDidMount() {
    let { readMore } = this.state;
    if (this.noiDung && this.noiDung.offsetHeight / this.state.lineHeight > this.state.rows) {
      readMore = {
        ...readMore,
        noiDung: true
      };
    }
    this.setStateReadMore(readMore);
  }

  /**
   * Set state read more
   * @param {object} readMore
   * @returns {void}
   * @memberof paragraph
   */
  setStateReadMore = (readMore) => {
    this.setState({ readMore });
  }

  /**
   * Function handleReadMore to setState readmore
   * @param {string} name
   * @returns {void}
   * @memberof paragraph
   */
  handleReadMore = (name) => {
    this.setState(
      prevState => ({ readMore: { ...prevState.readMore, [name]: !prevState.readMore[name] } })
    );
  }

  render() {
    return (
      <div ref={(el) => { this.noiDung = el; }} className="content-truncate">
        <span
          className="overflow-hidden"
          onClick={this.handleClick}
          style={
            {
              height: this.state.readMore.noiDung ? `${this.state.lineHeight * this.state.rows}px` : 'auto',
              lineHeight: `${this.state.lineHeight}px`
            }
          }
        >
          {Helpers.get(this.props, 'noiDung')}
        </span>
        { this.noiDung && this.noiDung.offsetHeight / this.state.lineHeight > this.state.rows && (
          <span
            className="see-more"
            onClick={(e) => {
              e.stopPropagation();
              this.handleReadMore('noiDung');
            }}
          >
            {this.state.readMore.noiDung ? 'Xem thêm' : 'Thu gọn'}
          </span>
        )}
      </div>
    );
  }
}

paragraph.propTypes = {
  rows: PropTypes.number,
  lineHeight: PropTypes.number
};

paragraph.defaultProps = {
  rows: 3,
  lineHeight: 18
};
