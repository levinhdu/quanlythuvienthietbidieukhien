import apiCaller from 'src/util/apiCaller'

const fetchData = function* fetchData(urlData, method, value) {
  let data = apiCaller(urlData, method, value);
  return yield data ? data : [];
}
export default fetchData;
