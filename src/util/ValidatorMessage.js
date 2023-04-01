const typeTemplate = "'${label}' không phải là ${type}";

export const defaultValidateMessages = {
  default: "Validation error on field '${label}'",
  required: "${label} là bắt buộc",
  enum: "'${label}' phải là một trong [${enum}]",
  whitespace: "'${label}' không đươc bỏ trắng",
  date: {
    format: "${label} không đúng định dạng ngày tháng",
    parse: "${label} không phải là ngày",
    invalid: "${label} không phải là ngày",
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate,
  },
  string: {
    len: "${label} cần phải có chính xác ${len} ký tự",
    min: "${label} cần có ít nhất ${min} ký tự",
    max: "${label} không thể nhiều hơn ${max} ký tự",
    range: "'${label}' cần phải nằm trong khoảng ${min} và ${max} ký tự",
  },
  number: {
    len: "${label} cần bằng ${len}",
    min: "${label} không thể nhỏ hơn ${min}",
    max: "${label} không thể lớn hơn ${max}",
    range: "${label} cần nằm trong khoảng ${min} và ${max}",
  },
  array: {
    len: "${label} cần có ${len} item",
    min: "${label} không thể ít hơn ${min} item",
    max: "${label} không thể lớn hơn ${max} item",
    range: "${label} cần nằm trong khoảng ${min} và ${max} item",
  },
  pattern: {
    mismatch: "${label} không đúng cấu trúc ${pattern}",
  },
};
