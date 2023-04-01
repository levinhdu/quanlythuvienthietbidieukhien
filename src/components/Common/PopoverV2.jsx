import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import Helpers from 'src/helpers';
import { isEqual } from 'lodash';

export default class PopoverV2 extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      isShow: false,
      contentPopover: null
    };
  }

  componentDidMount = () => {
    const contentPopover = this.contentPopover();
    this.setContentPopover(contentPopover);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.record, prevProps.record) || !isEqual(this.props.params, prevProps.params)) {
      const contentPopover = this.contentPopover(this.props);
      this.setContentPopover(contentPopover);
    }
  }

  /**
   * Called when a popover element is clicked
   * @param {object} element a popover element
   * @returns {void}
   * @memberof PopoverV2
   */
  clickPopoverElement = element => (e) => {
    e.stopPropagation();
    this.setState({ visible: false });
    if (element.onClick) {
      return element.onClick(this.props.record);
    }
    return false;
  }

  /**
   * Get the default render data for popover element
   * @param {object} element a popover element
   * @param {integer} key a unique key for the popover element
   * @returns {node} result
   * @memberof PopoverV2
   */
  defaultPopoverElement = (element, key = 0) => (
    <p
      key={key}
      className="item"
      onClick={this.clickPopoverElement(element)}
      role="presentation"
    >
      <span className={element.classNameIcon} />
      <span className="action-name">{element.name}</span>
    </p>
  )

  /**
   * Get the render data for popover element, using default or customize element
   * @param {object} element a popover element
   * @param {integer} key a unique key for the popover element
   * @returns {Component} result
   * @memberof PopoverV2
   */
  getPopopverElement = (element, key = 0) => {
    // set this.state.isShow if there is any element
    const { isShow = false } = this.state;
    if (!isShow) {
      this.setIsShow(true);
    }
    const { isDefault = true } = element;
    if (isDefault) {
      return this.defaultPopoverElement(element, key);
    }
    return (
      <React.Fragment key={key}>
        element.content
      </React.Fragment>
    );
  }

  /**
   * Set value for this.state.isShow
   * @param {boolean} isShow
   * @returns {void}
   * @memberof PopoverV2
   */
  setIsShow = (isShow = false) => {
    this.setState({ isShow });
  }

  /**
   * Set value for this.state.contentPopover
   * @param {node} contentPopover
   * @returns {void}
   * @memberof PopoverV2
   */
  setContentPopover = (contentPopover = null) => {
    this.setState({ contentPopover });
  }

  /**
   * Parse content for popover from props.params
   * @return {node} result of this.getPopopverElement
   * @memberof PopoverV2
   */
  contentPopover = (props = {}) => {
    const {
      params = this.props.params,
      record = this.props.record,
      userPermission = this.props.userPermission
    } = props;
    if (!params || !params.length) {
      return null;
    }
    return (
      <div className="popover-confirm">
        {params.map((param, i) => {
          if (Helpers.isValidCondition({
            conditions: param.conditions,
            record,
            userPermission,
            isOrConditions: param.isOrConditions
          })) {
            return this.getPopopverElement(param, i);
          }
          return null;
        })}
      </div>
    );
  }

  /**
   * Change visible for popover
   * @param {boolean} value
   * @returns {void}
   * @memberof PopoverV2
   */
  handleChangeVisible = (value) => {
    this.setState({ visible: value });
  }

  /**
   * Called when the popover is clicked
   * @param {object} e
   * @returns {void}
   * @memberof PopoverV2
   */
  clickPopover = e => e.stopPropagation()

  render() {
    return (
      <Popover
        className="popover-table"
        content={this.state.contentPopover}
        onClick={this.clickPopover}
        onVisibleChange={this.handleChangeVisible}
        placement={this.props.placement}
        trigger="hover"
        visible={this.state.visible}
      >
        {this.state.isShow && (<span className="icon-action icon-cpc" />)}
      </Popover>
    );
  }
}

PopoverV2.propTypes = {
  record: PropTypes.any,
  params: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    classNameIcon: PropTypes.string,
    onClick: PropTypes.func,
    isDefault: PropTypes.bool,
    content: PropTypes.node,
    conditions: PropTypes.arrayOf(PropTypes.shape({
      operator: PropTypes.string,
      originValueName: PropTypes.string,
      targetValueName: PropTypes.string,
      originValue: PropTypes.any,
      targetValue: PropTypes.any,
      permission: PropTypes.arrayOf(PropTypes.string),
      isOrPermission: PropTypes.bool
    })),
    isOrConditions: PropTypes.bool
  })),
  userPermission: PropTypes.arrayOf(PropTypes.string),
  placement: PropTypes.string
};

PopoverV2.defaultProps = {
  record: {},
  params: [{
    type: '',
    name: '',
    classNameIcon: '',
    isDefault: true,
    content: '',
    conditions: [],
    orConditions: false
  }],
  userPermission: [],
  placement: 'bottomRight'
};

/*
  Format this.props.params
  params: [{
    content: (<span>This is the content of popover</span>),
    conditions: [
      // this.state.check === true
      {
        type: 'chinh-sua',
        name: 'chinh sua'
        operator: '=',
        originValue: this.state.check,
        targetValue: true
        permission: [],
        isOrPermission: false
      },
      // (record.value !== record.compareValue)
      {
        operator: '<>',
        originValueName: value,
        targetValueName: compareValue,
        permission: [],
        isOrPermission: false
    ],
    isOrCondition: true
  }]
*/
