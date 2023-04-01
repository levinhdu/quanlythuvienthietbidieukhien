import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import {
  indexOf,
  debounce,
  isEmpty,
  isArray,
  isFunction
} from 'lodash';
import PropTypes from 'prop-types';
import Helpers from 'src/helpers';

const { Option } = Select;

let isMounted = true;

/**
 * Set isMounted
 * @param {boolean} value
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};

/**
 * Get isMounted
 */
const getIsMounted = () => isMounted;

export default class SelectSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.loadData = debounce(this.loadData, this.props.delay);
    this.state = {
      value: undefined,
      loading: false,
      valueAtrr: 'value',
      nameAtrr: 'name',
      searchInput: '',
      searched: false
    };
    setIsMounted(true);
  }

  componentDidMount = () => {
    if (!isEmpty(this.props.options) || !isEmpty(this.props.value)) {
      const valueAtrr = this.props.options[0] || this.state.valueAtrr;
      const nameAtrr = this.props.options[1] || this.state.nameAtrr;
      this.setStateData({ valueAtrr, nameAtrr, value: this.convertValue(this.props.value) });
    }
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.value !== this.props.value) {
      this.setStateData({ value: this.convertValue(this.props.value) });
    }
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof SelectSearch
   */
  setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Convert value select
   * @param {string|array} value Giá trị của select box
   * @param {string|array} option Option select
   * @returns {string|array} Giá trị sau cùng
   * @memberof SelectSearch
   */
  convertValue = (value, option = null) => {
    if (this.props.mode === 'default') {
      return value;
    }
    const optionArr = isArray(option) ? option : [option];
    const records = optionArr.map(item => Helpers.get(item, 'props.record'));
    let newValue = isArray(value) ? value : [];
    if (isFunction(this.props.onConvertData)) {
      newValue = newValue.map((item) => {
        const record = records.find(record => Helpers.get(record, 'id') === Helpers.get(item, 'key'));
        return this.props.onConvertData({ ...record, ...item });
      });
    }
    return newValue;
  }

  /**
   * Load data cho selelect box
   * @param {string} value Giá trị của search input
   * @returns {void} Kiểm tra và gọi props.onLoadData để load data
   * @memberof SelectSearch
   */
  loadData = async (value) => {
    if (!isFunction(this.props.onLoadData)) {
      return false;
    }
    return new Promise(async (resolve, reject) => {
      try {
        await this.setStateData({ loading: true, searched: true });
        await this.props.onLoadData(value);
        resolve();
      } catch (error) {
        reject();
      } finally {
        await this.setStateData({ loading: false, searchInput: '' });
      }
    });
  };

  /**
   * Cập nhậ giá trị cho state.searchInput
   * @param {string} value Giá trị của search input
   * @returns {void}
   * @memberof SelectSearch
   */
  handleChangeSearchInput = (value) => {
    // delay 500 milliseconds
    const setSearchInput = debounce((value) => {
      this.setStateData({ searchInput: value, searched: false });
    }, 500);
    setSearchInput(value);
  }

  /**
   * Change select
   * @param {string} items the items
   * @returns {void} call props.onChange
   * @memberof SelectSearch
   */
  handleChange = (items, option) => {
    if (this.state.searchInput) {
      return;
    }
    const value = this.convertValue(items, option);
    this.setStateData({
      value,
      loading: false
    });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  /**
   * Khi search input được trigger onKeyDown
   * @param {object} e Event object
   * @returns {void} Kiểm tra và gọi this.loadData
   * @memberof SelectSearch
   */
  handleInputKeyDown = (e) => {
    const enterKeyCode = 13;
    // gọi this.loadData nếu người dùng enter
    if (Helpers.get(e, 'keyCode') === enterKeyCode && !this.state.loading) {
      this.loadData(Helpers.get(e, 'target.value'));
    }
  }


  /**
   * Hiển thị notFoundContent của select search
   * @returns {node}
   * @memberof SelectSearch
   */
  renderNotFoundContent = () => {
    // khi đang loading => hiển thị loading
    if (this.state.loading) {
      return <Spin size="small" />;
    }
    // khi có dữ liệu select => hiển thị dữ liệu
    if (!isEmpty(this.props.dataSelect)) {
      return null;
    }
    // khi chưa search => không hiển thị
    if (!this.state.searched) {
      return null;
    }
    // mặc định hiển thị "Trống"
    return undefined;
  }

  render() {
    const {
      value,
      valueAtrr,
      nameAtrr
    } = this.state;
    const dataSelect = !this.state.loading ? this.props.dataSelect : [];
    return (
      <Select
        className={`'w-100' ${this.props.className}`}
        dataDisable={this.props.dataDisable}
        defaultActiveFirstOption={this.props.defaultActiveFirstOption}
        dropdownClassName={`dropdown-${this.props.name}`}
        filterOption={this.props.filterOption}
        labelInValue={this.props.labelInValue}
        mode={this.props.mode}
        notFoundContent={this.renderNotFoundContent()}
        onChange={this.handleChange}
        onInputKeyDown={this.handleInputKeyDown}
        onSearch={this.handleChangeSearchInput}
        placeholder={this.props.placeholder}
        showArrow={this.props.showArrow}
        showSearch={this.props.showSearch}
        style={this.props.style}
        value={value}
      >
        {dataSelect.map((item, index) => (
          <Option
            key={index}
            disabled={indexOf(this.props.dataDisable, item[valueAtrr]) !== -1}
            name={item[nameAtrr]}
            record={item}
            value={item[valueAtrr]}
          >
            {item[nameAtrr]}
          </Option>
        ))}
      </Select>
    );
  }
}

SelectSearch.propTypes = {
  delay: PropTypes.number,
  dataSelect: PropTypes.arrayOf(PropTypes.any),
  dataDisable: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  // moi element trong mot form se co "name" khac nhau
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any),
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  placeholder: PropTypes.string,
  mode: PropTypes.string,
  filterOption: PropTypes.bool,
  showSearch: PropTypes.bool,
  labelInValue: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
  onLoadData: PropTypes.func,
  onConvertData: PropTypes.func,
  showArrow: PropTypes.bool,
  defaultActiveFirstOption: PropTypes.bool
};

SelectSearch.defaultProps = {
  delay: 800,
  dataSelect: [],
  dataDisable: [],
  className: '',
  name: '',
  onChange: null,
  options: null,
  placeholder: '',
  mode: 'default',
  filterOption: false,
  showSearch: false,
  labelInValue: false,
  style: { width: '100%' },
  onLoadData: null,
  onConvertData: null,
  showArrow: true,
  defaultActiveFirstOption: false
};
