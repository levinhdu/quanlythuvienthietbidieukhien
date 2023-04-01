import apiCallerDemo from 'src/util/apiCallerDemo'

const fetchDataDemo = function* fetchDataDemo(urlData, method, value) {
  let data = apiCallerDemo(urlData, method, value);
  return yield data ? data : [];
}
export default fetchDataDemo;
